import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Playable } from "@/types/catalog";
import { readStorage, writeStorage } from "@/lib/storage";
import { useLanguage } from "@/context/LanguageContext";

type PlayerContextValue = {
  current: Playable | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  volume: number;
  play: (item: Playable) => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Playable | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(() => readStorage("player.volume", 0.8));

  if (!audioRef.current) audioRef.current = new Audio();

  useEffect(() => {
    const audio = audioRef.current!;
    const onPlaying = () => { setIsPlaying(true); setIsLoading(false); setError(null); };
    const onWaiting = () => setIsLoading(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError(t("streamPlaybackError"));
    };
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("loadstart", onWaiting);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("loadstart", onWaiting);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [t]);

  const play = useCallback((item: Playable) => {
    const audio = audioRef.current!;
    setError(null);
    setCurrent(item);
    if (audio.src !== item.audioUrl) audio.src = item.audioUrl;
    audio.volume = volume;
    setIsLoading(true);
    void audio.play().catch(() => {
      setIsLoading(false);
      setError(t("playbackBlocked"));
    });
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: item.title,
        artist: item.subtitle || "Radiogram",
        artwork: item.artworkUrl ? [{ src: item.artworkUrl }] : undefined,
      });
    }
  }, [t, volume]);

  const toggle = useCallback(() => {
    const audio = audioRef.current!;
    if (!current) return;
    if (audio.paused) {
      setIsLoading(true);
      void audio.play().catch(() => setError(t("resumeError")));
    } else {
      audio.pause();
    }
  }, [current, t]);

  const setVolume = useCallback((nextVolume: number) => {
    const clamped = Math.max(0, Math.min(1, nextVolume));
    audioRef.current!.volume = clamped;
    setVolumeState(clamped);
    writeStorage("player.volume", clamped);
  }, []);

  const stop = useCallback(() => {
    audioRef.current!.pause();
    audioRef.current!.removeAttribute("src");
    setCurrent(null);
    setError(null);
  }, []);

  return (
    <PlayerContext.Provider value={{ current, isPlaying, isLoading, error, volume, play, toggle, setVolume, stop }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const value = useContext(PlayerContext);
  if (!value) throw new Error("usePlayer must be used inside PlayerProvider");
  return value;
};

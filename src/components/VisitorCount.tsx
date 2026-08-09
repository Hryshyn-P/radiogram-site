import { useEffect, useState } from "react";

const VISITOR_COUNT_URL =
  "https://script.google.com/macros/s/AKfycbzAGLypF99XyzKfsulVgKb5GDKe5AvU-KJklYs2y1mis5blTRmxqqpeL9irusG4_Jil/exec";
type VisitorCallback = (payload: { visitors?: number }) => void;

const VisitorCount = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const callbackName = `radiogramVisitorCount_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    const callbackWindow = window as Window & Record<string, VisitorCallback | undefined>;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      script.remove();
      delete callbackWindow[callbackName];
    }, 8_000);

    callbackWindow[callbackName] = ({ visitors }) => {
      if (Number.isFinite(visitors) && visitors! >= 0) setCount(visitors!);
      window.clearTimeout(timeout);
      script.remove();
      delete callbackWindow[callbackName];
    };

    script.async = true;
    script.src = `${VISITOR_COUNT_URL}?callback=${callbackName}`;
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete callbackWindow[callbackName];
    };
    document.head.appendChild(script);

    return () => {
      window.clearTimeout(timeout);
      script.remove();
      delete callbackWindow[callbackName];
    };
  }, []);

  if (count === null) return null;

  return (
    <span
      className="visitor-count"
      aria-label={`${count.toLocaleString()} unique visitors recorded since analytics was enabled`}
      title="Unique visitors recorded since analytics was enabled"
    >
      · {count.toLocaleString()}
    </span>
  );
};

export default VisitorCount;

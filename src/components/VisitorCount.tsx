import { useEffect, useState } from "react";

const VISITOR_COUNT_URL =
  "https://script.google.com/macros/s/AKfycbzAGLypF99XyzKfsulVgKb5GDKe5AvU-KJklYs2y1mis5blTRmxqqpeL9irusG4_Jil/exec";
const CALLBACK_NAME = "radiogramVisitorCount";

declare global {
  interface Window {
    radiogramVisitorCount?: (payload: { visitors?: number }) => void;
  }
}

const VisitorCount = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => script.remove(), 8_000);

    window[CALLBACK_NAME] = ({ visitors }) => {
      if (Number.isFinite(visitors) && visitors! >= 0) setCount(visitors!);
      window.clearTimeout(timeout);
      script.remove();
      delete window[CALLBACK_NAME];
    };

    script.async = true;
    script.src = `${VISITOR_COUNT_URL}?callback=${CALLBACK_NAME}`;
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete window[CALLBACK_NAME];
    };
    document.head.appendChild(script);

    return () => {
      window.clearTimeout(timeout);
      script.remove();
      delete window[CALLBACK_NAME];
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

import { useScrollAnimation } from "./useScrollAnimation";

export default function CardFade({ children }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "all 0.8s ease",
        backdropFilter: isVisible ? "blur(0px)" : "blur(10px)",
        WebkitBackdropFilter: isVisible ? "blur(0px)" : "blur(10px)",
      }}
    >
      {children}
    </div>
  );
}
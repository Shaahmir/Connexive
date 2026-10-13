import { useScrollAnimation } from "./useScrollAnimation";

export default function CardTB ({ children }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        transition: "all 0.6s ease",
        backdropFilter: isVisible ? "blur(0px)" : "blur(10px)",
        WebkitBackdropFilter: isVisible ? "blur(0px)" : "blur(10px)",
      }}
    >
      {children}
    </div>
  );
};
import CardFade from "../utils/cardAnimateFade";

export default function TagButton({ Description, Svg }) {
  return (
    <CardFade>
      <span style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn-tag">
          <img src={Svg} loading="lazy" /> {Description}
        </button>
      </span>
    </CardFade>
  );
}

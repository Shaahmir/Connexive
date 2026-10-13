import CardSlide from "../utils/cardAnimateSlide";
import CardFade from "../utils/cardAnimateFade";

export default function CardComponent({ svg, head1, head2, paragraph, link }) {
  return (
    <CardSlide>
      <div>
        <img src={svg} />
        <h1>
          {head1} <br /> {head2}
        </h1>
        <p>{paragraph}</p>
        <CardFade>
          <div className="svgs">
            <iframe src={link} loading="lazy" />
          </div>
        </CardFade>
      </div>
    </CardSlide>
  );
}

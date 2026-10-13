export default function SliderCard({ svg, rate, paragraph, name, designation, company }) {
  return (
    <div>
      <img src={svg} loading="lazy" />
      <h2>{rate}</h2>
      <p>{paragraph}</p>
      <div className="reference">
        <h4>{name} - {designation}</h4>
        <h4>{company}</h4>
      </div>
    </div>
  );
}

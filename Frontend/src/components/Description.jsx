export default function Description({ svg, head, para1, para2 }) {
  return (
    <div className="landing-description">
      <span>
        <h3>
          <img src={svg} loading="lazy" /> {head}
        </h3>
        <p>
          {para1} <br />
          {para2}
        </p>
      </span>
    </div>
  );
}

function Hero({ titulo, descripcion, btn1, btn2 }) {
  return (
    <header id="home" className="hero py-5 border-bottom border-secondary-subtle">
      <div className="container py-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <h1 className="display-5 section-title">{titulo}</h1>
            <p className="lead text-secondary">{descripcion}</p>
            <div className="d-flex gap-2 flex-wrap">
              <a href={btn1.link} className={`btn ${btn1.clase}`}>
                <i className={`bi ${btn1.icon} me-1`}></i> {btn1.text}
              </a>
              <a href={btn2.link} className={`btn ${btn2.clase}`}>
                <i className={`bi ${btn2.icon} me-1`}></i> {btn2.text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;

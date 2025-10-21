function Footer() {
  return (
    <footer className="py-4 border-top border-secondary-subtle">
      <div className="container small text-secondary d-flex flex-wrap gap-3 justify-content-between">
        <span>© {new Date().getFullYear()} Level-Up Gamer</span>
        <span>Misión: Proveer productos de alta calidad y experiencia personalizada.</span>
        <span>Visión: Ser líderes con innovación, servicio excepcional y gamificación.</span>
      </div>
    </footer>
  );
}
export default Footer;

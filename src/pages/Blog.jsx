import CardBlog from "../components/CardBlog";
import Footer from "../components/Footer";

function Blog() {
  return (
    <>
      {/* Contenedor principal */}
      <div className="container my-5">
        <h2 className="section-title mb-4">Blog & Noticias</h2>

        {/* Fila de tarjetas */}
        <div className="row g-4">
          <CardBlog
            titulo="Cómo elegir tu silla gamer ideal Calidad-Precio"
            categoria="Guías"
            descripcion="La guia sobre como elegir tu silla gamer calidad-precio combinando ergonomía, durabilidad y diseño atractivo sin romper el banco."
            imagenSrc="/img/blogSilla.jpg"  // 👈 desde public/img/
            videoUrl="https://www.youtube.com/embed/vZG9w2BDHDg?si=4A4FcKeZcFSKpSFE"
          />
          <CardBlog
            titulo="La MEJOR PC GAMER para cada presupuesto en 2025"
            categoria="Reviews"
            descripcion="En 2025, la elección de la mejor PC gamer depende de tus necesidades y presupuesto."
            imagenSrc="/img/blog2Pcs.jpg"
            videoUrl="https://www.youtube.com/embed/blA9MqxF0-A?si=i5JTwcJGJ4B8MMTz"
          />
          <CardBlog
            titulo="Periféricos buenos, bonitos y baratos"
            categoria="Tips"
            descripcion="En 2025, existen opciones destacadas que combinan rendimiento y diseño sin comprometer el presupuesto."
            imagenSrc="/img/blog3Perifericos.png"
            videoUrl="https://www.youtube.com/embed/XWKZqhBx1XA?si=rY99wSPrllscYGTt"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Blog;

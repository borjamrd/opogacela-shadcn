export default function PoliticaPrivacidad() {
  return (
    <div className="container py-24 sm:py-32">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
      <p className="mb-4">
        En esta sección, se detalla cómo se recopila, utiliza y protege la
        información personal de los usuarios.
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        Recopilación de Información
      </h2>
      <p className="mb-4">
        Se recopila información personal como nombre, correo electrónico y
        dirección para procesar el pedido y enviar posteriores actualizaciones
        del temario.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Uso de la Información</h2>
      <p className="mb-4">
        La información recopilada se utiliza para gestionar pedidos, enviar
        actualizaciones y mejorar nuestros servicios. En caso de que el usuario
        no desee recibir actualizaciones, puede darse de baja en cualquier
        momento escribiendo un correo a{" "}
        <a href="mailto:instaopogacela@gmail.com" className="underline">
          instaopogacela@gmail.com
        </a>
        .
      </p>
      <h2 className="text-2xl font-semibold mb-2">Protección de Datos</h2>
      <p className="mb-4">
        Implementamos medidas de seguridad para proteger la información personal
        contra accesos no autorizados.
      </p>
      <h3 className="text-2xl font-semibold mb-2">Cookies</h3>
      <p className="mb-4">
        Las cookies son pequeños archivos que se almacenan en el dispositivo del
        usuario y permiten recordar preferencias y visitas anteriores. En
        opogacela gestionamos únicamente las cookes necesarias para el
        funcionamiento del sitio web, como las de sesión y las de preferencias
        de idioma. No utilizamos cookies de seguimiento o publicidad.
      </p>
    </div>
  );
}

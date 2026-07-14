async function cargarCatalogo() {
  const grid = document.getElementById('grid-productos');
  try {
    const resp = await fetch('/catalogo.json');
    const productos = await resp.json();
    return productos;
  } catch (err) {
    grid.innerHTML = '<p class="sin-resultados">No se pudo cargar el catalogo.</p>';
    return [];
  }
}

function crearTarjeta(producto) {
  const mensaje = encodeURIComponent('Hola, me interesa una de sus bolsas del catalogo.');
  const waLink = 'https://wa.me/529987572466?text=' + mensaje;

  const media = producto.tipo === 'video'
    ? '<video src="' + producto.imagen_url + '" muted loop autoplay playsinline></video>'
    : '<img src="' + producto.imagen_url + '" alt="Mar Dorado Luxe" loading="lazy">';

  return (
    '<div class="producto-card">' +
      media +
      '<div class="producto-info">' +
        '<a class="producto-wa" href="' + waLink + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
      '</div>' +
    '</div>'
  );
}

async function init() {
  const grid = document.getElementById('grid-productos');
  const productos = await cargarCatalogo();

  if (productos.length === 0) {
    grid.innerHTML = '<p class="sin-resultados">Catalogo en preparacion.</p>';
    return;
  }

  grid.innerHTML = productos.map(crearTarjeta).join('');
}

init();

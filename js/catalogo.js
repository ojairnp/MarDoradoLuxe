const CATALOGO_BASE_URL = 'https://raw.githubusercontent.com/ojairnp/MarDoradoLuxe/main/';

async function cargarCatalogo() {
  const grid = document.getElementById('grid-productos');
  try {
    const resp = await fetch(CATALOGO_BASE_URL + 'catalogo.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error("Error HTTP del catálogo");
    const productos = await resp.json();
    if (!Array.isArray(productos)) throw new Error("Formato de catálogo inválido");
    return productos.map(function (producto) {
      return Object.assign({}, producto, {
        imagen_url: CATALOGO_BASE_URL + producto.imagen_url.replace(/^\/+/, '')
      });
    });
  } catch (err) {
    grid.innerHTML = '<p class="sin-resultados">No se pudo cargar el catalogo.</p>';
    return null;
  }
}

function ordenarVideosPrimero(productos) {
  const videos = productos.filter(function (p) { return p.tipo === 'video'; });
  const imagenes = productos.filter(function (p) { return p.tipo === 'imagen'; });
  return videos.concat(imagenes);
}

function crearTarjeta(producto) {
  const urlCompleta = new URL(producto.imagen_url, window.location.href).href;
  const mensaje = encodeURIComponent('Hola, me interesa esta pieza: ' + urlCompleta);
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
  if (productos === null) return;
  const ordenados = ordenarVideosPrimero(productos);

  if (ordenados.length === 0) {
    grid.innerHTML = '<p class="sin-resultados">Catalogo en preparacion.</p>';
    return;
  }

  grid.innerHTML = ordenados.map(crearTarjeta).join('');
}

init();

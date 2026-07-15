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

function ordenarVideosPrimero(productos) {
  const videos = productos.filter(function (p) { return p.tipo === 'video'; });
  const imagenes = productos.filter(function (p) { return p.tipo === 'imagen'; });
  return videos.concat(imagenes);
}

function crearTarjeta(producto) {
  const urlCompleta = window.location.origin + producto.imagen_url;
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
  const ordenados = ordenarVideosPrimero(productos);

  if (ordenados.length === 0) {
    grid.innerHTML = '<p class="sin-resultados">Catalogo en preparacion.</p>';
    return;
  }

  grid.innerHTML = ordenados.map(crearTarjeta).join('');
}

init();
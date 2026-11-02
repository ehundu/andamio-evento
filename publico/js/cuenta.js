/* La cuenta atrás de la portada. Sin este script la página enseña la fecha de comienzo y el reloj queda oculto; con él, cuánto
   falta, y cuando llega la hora, que el evento está en marcha o que ya ha terminado. Los textos y las fechas vienen del HTML
   (parciales/cuenta-atras.twig), así que no hay nada que cambiar aquí para otro evento ni para otro idioma. No guarda nada
   en el navegador. */
(function () {
  var cuenta = document.querySelector('[data-cuenta]');
  if (!cuenta) return;

  var inicio = Date.parse(cuenta.getAttribute('data-inicio'));
  var fin = Date.parse(cuenta.getAttribute('data-fin'));
  if (isNaN(inicio)) return;

  var reloj = cuenta.querySelector('.cuenta__reloj');
  var mensaje = cuenta.querySelector('[data-mensaje]');
  var texto = cuenta.querySelector('[data-texto]');
  var unidades = {};
  Array.prototype.forEach.call(cuenta.querySelectorAll('[data-unidad]'), function (cifra) {
    unidades[cifra.getAttribute('data-unidad')] = { cifra: cifra, nombre: cifra.nextElementSibling };
  });

  var ultimoTexto = '';

  function pintar() {
    var ahora = Date.now();
    var estado = ahora < inicio ? 'antes' : (isNaN(fin) || ahora < fin ? 'durante' : 'despues');

    cuenta.setAttribute('data-estado', estado);
    mensaje.textContent = cuenta.getAttribute('data-' + estado);

    if (estado !== 'antes') {
      texto.textContent = mensaje.textContent;
      return estado;
    }

    var segundos = Math.floor((inicio - ahora) / 1000);
    var valores = {
      dias: Math.floor(segundos / 86400),
      horas: Math.floor((segundos % 86400) / 3600),
      minutos: Math.floor((segundos % 3600) / 60),
      segundos: segundos % 60
    };

    var partes = [];
    Object.keys(valores).forEach(function (clave) {
      var unidad = unidades[clave];
      var valor = valores[clave];
      unidad.cifra.textContent = valor;
      unidad.nombre.textContent = unidad.nombre.getAttribute(valor === 1 ? 'data-uno' : 'data-varios');
      if (clave !== 'segundos') partes.push(valor + ' ' + unidad.nombre.textContent);
    });

    // El texto para los lectores de pantalla cambia una vez por minuto, no cada segundo
    var frase = mensaje.textContent + ' ' + partes.join(', ');
    if (frase !== ultimoTexto) {
      texto.textContent = frase;
      ultimoTexto = frase;
    }

    return estado;
  }

  reloj.hidden = false;
  if (pintar() === 'despues') return;

  var intervalo = setInterval(function () {
    if (pintar() === 'despues') clearInterval(intervalo);
  }, 1000);
})();

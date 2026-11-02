# Andamio de evento para Ehundu

Un sitio para un evento, hecho con [Ehundu](https://ehundu.com), el generador de sitios estáticos en PHP. Es un andamio: la estructura de partida de la web de unas jornadas, un congreso, un festival o una charla grande. Trae una cuenta atrás, el programa por días y por salas, los ponentes con su ficha, las entradas con sus plazos, el lugar, los patrocinadores, unas preguntas frecuentes, un código de conducta, un calendario para descargar y los textos legales de modelo. Cambias los textos, los datos y el CSS, y es tuyo.

El evento de ejemplo, Hilván, es inventado, como sus ponentes y sus patrocinadores. Las fechas son de mayo de 2027: si abres el andamio mucho después, la cuenta atrás dirá que ya ha terminado y los avisos con plazo habrán desaparecido. Cambia las fechas y vuelve a compilar.

Necesitas PHP 8.4 o superior y [Composer](https://getcomposer.org).

## Empezar

Si lo has creado con `composer create-project`, ya está todo instalado. Si has usado el botón «Use this template» de GitHub, o has descargado el zip, instala el motor:

```
composer install
```

Las tres órdenes que vas a usar:

```
composer servir      # lo previsualiza en http://127.0.0.1:8000/ y rehace solo lo que cambia
composer compilar    # deja el sitio terminado en la carpeta salida/
composer desplegar   # lo compila y lo sube al servidor que digas en sitio.yml
```

## Lo primero que cambiar

1. En `sitio.yml`, el nombre, la dirección del sitio, la descripción y la zona horaria del evento.
2. En `datos/evento.yml`, los datos de tu evento: nombre, edición, cuándo empieza y termina, los días del programa, el lugar, dónde se compran las entradas y quién organiza. Salen en la cabecera, el pie, la portada, la cuenta atrás, el calendario, la página del lugar y los datos para los buscadores, sin escribirlos dos veces.
3. Tus ponentes, en `contenido/ponentes/`, y tus sesiones, en `contenido/programa/sesiones/`.
4. Tus entradas, en `contenido/entradas/`, y tus avisos, en `contenido/avisos/`.
5. En `datos/patrocinadores.yml`, quién patrocina; y en `datos/titular.yml`, quién es el titular legal del sitio.
6. Los textos de `index.md`, `programa.md`, `ponentes.md`, `entradas.md`, `lugar.md`, `patrocinadores.md`, `preguntas-frecuentes.md` y `codigo-de-conducta.md`.
7. En `publico/css/estilos.css`, los colores: están al principio, en variables, con su pareja para el modo oscuro. La franja oscura de la portada tiene los suyos.

## Las fechas y la hora

En `datos/evento.yml`, el principio y el final se escriben con el día sin comillas (`2027-05-14`) y la hora entre comillas (`"09:00"`), de 24 horas. No hay que escribir el desfase de la zona horaria, porque Ehundu lo calcula con la `zonaHoraria` de `sitio.yml`, también con el cambio de hora de verano. Con ellas salen la cuenta atrás, los datos para los buscadores y las horas de los calendarios.

Las horas de cada sesión se escriben igual, entre comillas, con el cero delante: `"09:30"`. Sin comillas, YAML puede leerla como otra cosa.

## La cuenta atrás

La cuenta atrás es la única parte del sitio que necesita JavaScript, y es opcional. Sin él, la portada enseña «Empieza el viernes 14 de mayo, a las 09:00» y nada más. Con él (`publico/js/cuenta.js`, unas setenta líneas), el reloj muestra cuánto falta, y cuando llega la hora dice que el evento está en marcha y, al terminar, que ya ha terminado.

Los textos y las fechas vienen del HTML (`parciales/cuenta-atras.twig`), así que el script no se toca para cambiar de evento ni de idioma. Solo la portada lo carga, porque es la única página que lo declara, con su campo `js` (`js: [js/cuenta.js]` en `contenido/index.md`). El script no guarda nada en tu navegador, y por eso la política de cookies puede decir que no hay cookies. Para quitar la cuenta atrás, borra esa línea de `index.md` y el `<div class="cuenta">` de `plantillas/inicio.twig`.

## El programa

Cada sesión es un fichero Markdown de `contenido/programa/sesiones/`, dentro de la carpeta de su día. Cada día tiene su carpeta con un `_datos.yml` que dice el `dia` una sola vez para todas sus sesiones, así que no hay que repetirlo. El front matter de una sesión, el bloque entre `---` del principio:

```yaml
titulo: Accesible desde la primera línea
hora: "12:00"
fin: "12:45"
sala: Sala 1
tipo: charla
ponentes: [leire-goikoetxea]
```

`tipo` es uno de `keynote` (charla principal, destacada), `charla`, `taller`, `mesa` (mesa redonda), `general` (la bienvenida o el cierre, sin ponentes) y `pausa` (un café, la comida: sale discreta y no entra en el calendario). `ponentes` es una lista con los nombres de fichero de las fichas. Si una sesión tiene varios, salen todos. El texto de debajo es «De qué va», en un desplegable que no necesita JavaScript.

Las sesiones de un día salen ordenadas por `hora` y, a igual hora, por `sala`. Por eso conviene que los nombres de las salas ordenen como quieres que se vean: `Sala 1` y `Sala 2` sí; «Sala principal» iría después de «Sala 2».

Para añadir un día, apúntalo en `dias` de `datos/evento.yml` y crea su carpeta de sesiones con su `_datos.yml`.

## Los ponentes

Cada ponente es un fichero de `contenido/ponentes/`. El nombre del fichero es su clave: `ana-ruiz.md` sale en `/ponentes/ana-ruiz/` y las sesiones lo nombran como `ana-ruiz`.

```yaml
titulo: Ana Ruiz
cargo: Directora de diseño
organizacion: Estudio Marea
foto: img/ponentes/ana-ruiz.svg
keynote: true
enlaces:
  - nombre: Su web
    url: https://example.org/ana-ruiz
```

`keynote: true` lo lleva a la portada y a lo alto de la lista. Es un campo propio, y en un campo propio `sí` y `no` son texto: para un verdadero o un falso se escribe `true` o `false`, sin comillas. Las fotos de ejemplo son avatares con iniciales; pon las de verdad en `publico/img/ponentes/` y cámbialas en `foto`. La ficha de cada ponente lista sus sesiones, que Ehundu encuentra buscando su clave en el campo `ponentes` de todas.

## Entradas y avisos que salen y caducan solos

Un tipo de entrada es un fichero de `contenido/entradas/` y un aviso de arriba es uno de `contenido/avisos/`. Ninguno tiene página propia (`url: false` en su `_datos.yml`): la página de entradas, los datos para los buscadores y la franja de arriba los recogen por su etiqueta. Lo interesante son sus fechas:

```yaml
precio: 90
publicarHasta: 2027-03-31   # el último día en que se ve
```

`publicar` dice desde qué día sale y `publicarHasta`, hasta cuál: se ve durante todo ese día y desaparece a la medianoche siguiente, en la zona horaria del sitio. Así, la entrada anticipada se va sola el 31 de marzo y la general sale el 1 de abril, y el aviso de «quedan pocas plazas» solo se ve entre el 15 de abril y el 13 de mayo. Con las dos fechas se hace una ventana, y con una sola, un comienzo o un final. También sirven para anunciar ponentes más tarde: la ficha de Jon Mendizabal y su sesión llevan `publicar: 2027-02-15`, y hasta ese día no salen en ninguna parte, ni en los datos para los buscadores.

Un sitio estático no sabe qué día es hoy: aplica las fechas **cuando se compila**. Para que un plazo se cumpla el día exacto, compila y publica ese día, o programa una tarea que ejecute `composer desplegar` cada noche en tu servidor o en un servicio de integración continua. Si no, el cambio llegará con la próxima publicación que hagas.

## El calendario

El evento y el programa se pueden descargar para añadirlos al calendario del móvil o del ordenador: `/evento.ics` (un solo acto, que sale en la portada y en la página del lugar) y `/programa.ics` (una cita por sesión, sin las pausas, que sale en el programa). Son páginas como las demás, en `contenido/calendario-evento.twig` y `contenido/calendario-programa.twig`, pero su dirección acaba en `.ics` y no llevan plantilla (`plantilla: false`), así que sale su contenido tal cual. No entran en el sitemap (`listada: no`).

Las horas salen en UTC, que todos los calendarios entienden sin más datos, y los saltos de línea son los que pide el formato, `\r\n`. El formato también pide partir las líneas de más de 75 caracteres, y aquí no se parten: mantén cortos los títulos de las sesiones.

## Los datos para los buscadores

La portada lleva un bloque de datos estructurados (JSON-LD, del tipo `Event`) que Google y otros buscadores usan para enseñar el evento con su fecha, su lugar, sus ponentes y el precio de sus entradas. Sale de `datos/evento.yml` y de las colecciones de ponentes y entradas, así que no hay que escribirlo dos veces, y un ponente o una entrada que no está publicado, o que ya ha caducado, tampoco sale. Para comprobarlo, la herramienta de resultados enriquecidos de Google lee el sitio ya publicado.

## El lugar

La página «Lugar» da la dirección, cómo llegar, cuándo es y un enlace a OpenStreetMap hecho con las coordenadas de `datos/evento.yml`. No lleva un mapa incrustado a propósito: los mapas de Google o de OpenStreetMap cargan servicios de terceros y ponen cookies, y entonces tendrías que pedir consentimiento. Si aun así quieres uno, ponlo en `plantillas/lugar.twig`, y cambia la política de cookies y el aviso legal.

## Las entradas y el contacto

Un sitio estático no vende entradas ni procesa formularios. Los botones de compra llevan a la dirección que pongas en `entradas.enlace` de `datos/evento.yml`: una plataforma de venta, una página de tu asociación o un enlace de correo. Si lo dejas vacío, las tarjetas de entradas no llevan botón. La política de privacidad ya lo dice, pero tendrás que poner en ella la plataforma que uses. Si añades un formulario de contacto, un servicio que reciba el envío y te lo mande por correo, tendrás que contarlo también.

## Los patrocinadores

`datos/patrocinadores.yml` lleva los niveles en el orden en que salen, y en cada uno sus patrocinadores con su logotipo (un fichero de `publico/img/patrocinadores/`, mejor SVG) y su enlace. Un nivel vacío no sale. Los logotipos van sobre una tarjeta blanca para que se vean también en el modo oscuro.

## Los textos legales

Aviso legal, política de privacidad y política de cookies, en `contenido/legal/`, con los datos del titular de `datos/titular.yml`. **Son textos de modelo, para un evento organizado desde España cuya web no usa cookies ni analítica y que vende las entradas en una plataforma externa, y no sustituyen el consejo de un profesional.** El código de conducta también lo es. Cada uno lleva arriba un recuadro amarillo que lo dice. Antes de publicar:

1. Pon los datos del titular de verdad en `datos/titular.yml`.
2. Léelos enteros y cámbialos según lo que haga tu sitio. Si vendes las entradas desde esta misma web, añades un formulario, analítica, un mapa o un vídeo incrustados o publicidad, hay cosas que ya no valen.
3. Pon en la política de privacidad la plataforma de venta de entradas que uses.
4. Cambia la fecha de «Última actualización» y borra el recuadro de cada uno.

## Qué hay en cada carpeta

```
sitio.yml                  el nombre, la dirección, la zona horaria y adónde se publica
contenido/                 las páginas, en Markdown: cada fichero es una página
  index.md                 la portada (declara el script de la cuenta atrás)
  programa.md              el programa; sus sesiones están en programa/sesiones/
  programa/sesiones/       un fichero por sesión, en una carpeta por día con su _datos.yml
  ponentes.md              la lista de ponentes; sus fichas están en ponentes/
  ponentes/                un fichero por ponente; su _datos.yml les da lo que comparten
  entradas.md              la página de entradas; los tipos están en entradas/
  entradas/                un fichero por tipo de entrada, con sus fechas
  avisos/                  los avisos de arriba, con sus fechas
  lugar.md, patrocinadores.md, preguntas-frecuentes.md, codigo-de-conducta.md
  calendario-evento.twig, calendario-programa.twig    los dos .ics
  legal/                   el aviso legal, la privacidad y las cookies
datos/                     tu evento, el menú, los patrocinadores y el titular legal
plantillas/                el HTML de cada tipo de página, con Twig
parciales/                 trozos de HTML que reutilizan las plantillas (la cuenta atrás, la sesión, los datos estructurados…)
  atajos/aviso.twig        el atajo [aviso], que dibuja el recuadro de los textos legales
publico/                   el CSS, el script de la cuenta atrás, las imágenes y el icono: se copia tal cual a la raíz
```

`salida/` (el sitio compilado) y `.ehundu/` (lo que recuerda el motor) los crea Ehundu y no se versionan.

## Publicarlo

Descomenta la sección `despliegue` de `sitio.yml` y rellénala. La contraseña no va ahí, porque `sitio.yml` se comparte: crea un fichero `.secretos.yml` en la raíz del proyecto, entre comillas simples:

```yaml
despliegue:
  clave: 'la-contraseña'
```

Antes de subir nada, mira qué haría:

```
composer desplegar -- --simular
```

Y cuando todo cuadre, `composer desplegar`. La guía [Desplegar el sitio](https://ehundu.com/documentacion/guias/desplegar/) explica los destinos (carpeta, FTP, SFTP y S3) y cómo decide Ehundu qué sube y qué borra, y [Un alojamiento compartido](https://ehundu.com/documentacion/guias/alojamiento-compartido/) cuenta lo que conviene saber si tu hosting es de los baratos.

## Para seguir

- [Tu primer sitio](https://ehundu.com/documentacion/empezar/tu-primer-sitio/), un recorrido paso a paso.
- [La hoja de referencia rápida](https://ehundu.com/documentacion/empezar/hoja-rapida/), con todo lo que vas a necesitar cada día.
- [La documentación completa](https://ehundu.com/documentacion/).

Licencia MIT.

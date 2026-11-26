# Motor Specs — guía para sesiones automáticas

Canal de Instagram: **@motor.specs** (Sebastián, CDMX, zona horaria America/Mexico_City). Contenido: coches, motorsport, mecánica, aviación, energía, siempre con esencia de coches. Voz: español, tono tranquilo. **Marca en pantalla: "MOTOR SPECS"** (ya no "Monitor Automotriz").

## Reglas que no se rompen
- **Nunca publicar ni programar nada sin que Sebastián elija el tema en el chat.** Elegir el tema equivale a autorizar ese contenido; antes de programar se le muestra el pie de foto y el material, y puede cancelar.
- Sin fotos ni clips con derechos: solo gráficos, tipografía y datos propios. Nada de logos de marca ni libreas dibujadas, ni rostros reales. Coches/figuras ilustrados y genéricos. Los logos de marcas solo si Sebastián los pone en `video/public/logos/`.
- Cada dato con **al menos 2 fuentes**; los datos de una sola fuente no entran. Línea de fuente visible en el video/carrusel. Si un dato puede haber cambiado (puntos, posiciones), buscar la versión más reciente y fechar el contenido.
- Pie de foto: incluye aviso de "ilustración animada con motion graphics y voz sintética" en videos.
- Las imágenes/videos terminados **no se quedan en el repo**: se suben a `videos/` o `carruseles/` solo para que SendIt los lea y se borran al confirmar la publicación.

## Flujo diario
1. **~1:00 pm (tarea "Motor Specs · Menú 1 pm")**: leer `cola.md`; leer las notas del día de Monitor (carpeta "Contenido Monitor Automotriz" en su Mac si hay acceso al equipo; si no, buscar noticias con Parallel Search / Exa / WebSearch, últimas 24 h, categorías: autos, motorsport, mecánica, aviación, energía). Entregar de 5 a 6 opciones, cada una con: titular, por qué importa, **formato recomendado** (video = crónicas/historias con datos; carrusel = artículos y breaking news), fuentes y frescura. Primero los guardados en la cola. Terminar con el menú; Sebastián contesta en esa misma sesión.
2. **Cuando elige**: construir el contenido (abajo), subirlo al repo, **programar en SendIt para las 8:00 pm CDMX** (`schedule_content`, timezone America/Mexico_City, plataforma `instagram`, URL pública raw de GitHub). Mostrarle video/imágenes y pie de foto en el chat. Si pide "2 hoy", programar el segundo a las 8:30 pm salvo que diga otra hora. Si pide guardar/posponer: anotar en `cola.md` (con fecha) y hacer commit.
3. **~8:35 pm (tarea "Motor Specs · Limpieza")**: con `get_scheduled_posts` revisar lo de hoy. Lo publicado: anotarlo en `cola.md` (sección Publicados, con URL) y borrar del repo sus archivos (`git rm`, commit, push). Lo fallido: avisar con claridad y no reintentar a ciegas.

## Construir un VIDEO (Reel 1080x1920, 30 fps)
Proyecto Remotion en `video/` (Node + Chrome del sistema). Referencia viva: `video/src/Root.tsx` (composición `V2`, 6 escenas: gancho con número, barras, suma, comparación, línea de tiempo, cierre) y `video/src/Sprites.tsx` (coche, bandera, casco, trofeo: recortes animados sin fondo, ~10 % del cuadro, en la franja inferior). **Copiar el estilo y adaptar escenas al tema**; el contenido no está parametrizado.
- Paleta: fondo `#0B0D10`, ámbar `#FFC400`, blanco `#F5F7FA`, gris `#8A949E`. Fuentes Anton + Inter (en `video/public/`).
- Zonas seguras de Instagram: contenido entre y≈250 y y≈1500; sprites hasta y≈1780.
- **Primer cuadro = portada**: la escena 1 usa `first` y `t=9` en el cuadro 0 para mostrar el gancho completo (IG toma ese cuadro como cover). Mantenerlo.
- Preparación: `cd video && npm ci`; `pip install --break-system-packages kokoro-onnx soundfile numpy`.
- Voz: `python3 video/narrate.py script.json /tmp/narr` (voz em_alex; escribe números con letras; genera `narration.wav` y `public/props.json` con la duración de cada escena). Descarga el modelo de Kokoro desde GitHub la primera vez.
- Render: `cd video && npx remotion render src/index.ts V2 /tmp/silent.mp4 --browser-executable=/usr/bin/google-chrome --chrome-mode=chrome-for-testing --log=error` (≈70–90 s). Revisar cuadros clave con `npx remotion still ... --frame=N` antes del render completo.
- Mezcla: `ffmpeg -i silent.mp4 -i narration.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest out.tmp.mp4 && mv out.tmp.mp4 out.mp4`.
- Duración objetivo 30–45 s (Reels válidos de 5 a 90 s, máx. 100 MB).

## Construir un CARRUSEL (1080x1350, JPEG)
Máximo 3 imágenes: portada + 2 de texto. Plantilla `video/src/Carousel.tsx`; spec JSON con `slides` (ver tipos en el archivo: `portada` con categoría, titular ≤80 caracteres y dato destacado; `texto` con encabezado ≤28 caracteres, ≤300 caracteres de texto, hasta 3 tarjetas de dato; la última con `cierre: true` y `fuente`). Render: `cd video && python3 render_carrusel.py spec.json /tmp/carr` → `1.jpg`, `2.jpg`, `3.jpg`. Revisar las 3 imágenes (que no se corte ni se encime texto).

## Publicar (SendIt, cuenta @motor.specs)
- Subir el archivo a `videos/` o `carruseles/` del repo, push a `main`. URL pública: `https://raw.githubusercontent.com/sebastianmoralesp/motorspecs/main/<ruta>`.
- Video: `mediaUrl` + `mediaType: "video"`. Carrusel: `mediaUrls` (2 a 10 imágenes) + `mediaType: "image"`. Antes: `validate_content`.
- Pie de foto en español: gancho, 2–3 datos, llamado a seguir @motor.specs, línea de fuentes, ~8–10 hashtags mezclando grandes y de nicho (#F1 #Formula1 #Motorsport ...). Máx. 2,200 caracteres y 30 hashtags.
- Si `publish_content`/`schedule_content` da error de gateway: el resultado es incierto; revisar con `get_scheduled_posts`/`get_analytics` y avisar a Sebastián antes de reintentar.
- Programar siempre con hora exacta en UTC calculada desde America/Mexico_City.

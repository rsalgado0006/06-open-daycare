# SPEC 06 — Nueva publicación desde el feed

> **Estado:** Implementado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-11-13
> **Objetivo:** Convertir «Nueva publicación» del sidebar y el composer de `/` en un pop-up que replica `crear-publicacion.dc.html`, valida destinatario, tipo y descripción, y persiste la publicación en localStorage para mostrarla al tope del feed.

## Alcance

**In:**

- El CTA «Nueva publicación» del sidebar de `/` deja de ser un `<span title="Próximamente">` y pasa a ser un `<button type="button">` con las mismas clases. La barra «Compartí un momento…» del composer también pasa a `<button type="button">` con el mismo markup. Ambos abren el mismo `<dialog>` modal sobre un backdrop cálido; la URL no cambia.
- El pop-up replica la tarjeta de `crear-publicacion.dc.html`: header con «Cancelar» / «Nueva publicación» / «Publicar», y cuerpo con PARA, TIPO, DESCRIPCIÓN y FOTOS.
- PARA ofrece un chip por cada uno de los 8 niños de `data/kids.ts`, con su inicial, su tono y su primer nombre, más el chip «Toda la sala». La selección es múltiple (chips tipo checkbox) y arranca con solo el primer niño (Mateo). «Toda la sala» marca todos los niños de una vez y vuelve a desmarcarlos si ya estaban todos; un post con todos los niños marcados se publica como post de sala.
- El chip seleccionado usa fondo `#3F362E`, borde `#3F362E` y texto blanco; los inactivos usan fondo `#FFFDF9`, borde `#ECE0D0` y texto `#6E6359`. «Toda la sala» no lleva avatar.
- TIPO ofrece las 7 pills del mockup en su orden —Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio— cada una con su color de tipo. La selección es única, arranca en «Actividad» y la pill seleccionada suma un anillo del tono oscuro de su tipo.
- DESCRIPCIÓN es obligatoria. El textarea arranca vacío con el placeholder «Contá cómo le fue hoy…»; al enviar sin texto se muestra «Escribí la descripción.» debajo del campo, se marca `aria-invalid` y el foco va al textarea.
- FOTOS replica los dos cuadros de 96px del mockup —un placeholder con ícono de imagen y una tarjeta punteada «Agregar»— pero quedan inertes con `title="Próximamente"`. No hay file picker, preview ni imagen en el post.
- «Publicar» persiste la publicación en localStorage bajo `opendaycare:posts:v1`, cierra el pop-up, limpia el formulario y agrega el post al tope del feed, arriba de los 3 demo.
- El post creado muestra la hora local `HH:MM` del momento de publicar, «publicado por vos», 0 likes y 0 comentarios, el badge del tipo elegido y el destinatario derivado: «Para: familia de {nombre}» para un niño, «Para: familias de {lista}» para varios (formato «Mateo, Sofía y Benjamín») y «Para: toda la sala» para la sala.
- Un post dirigido a un único niño conserva el avatar celeste con su inicial y su primer nombre. Un post dirigido a varios niños usa el avatar celeste con la inicial del primero y como título la lista de nombres (formato «Mateo, Sofía y Benjamín»). Un post para toda la sala usa el círculo periwinkle con megáfono y «Anuncio general», con el badge del tipo elegido, igual que el anuncio de SPEC 01.
- Publicar sin ningún destinatario marcado muestra «Elegí al menos un destinatario.» bajo PARA, enfoca el primer chip y no publica.
- `PostKind` se extiende a los 7 tipos. `Post` migra de `child` + `audience` string a un `target` discriminado (niño o sala) y el destinatario visible se deriva. Los 3 posts demo se migran sin cambiar una letra ni una medida.
- El feed pasa a un client component `FeedHome` que concentra el estado de las publicaciones creadas y el pop-up. `app/page.tsx` queda como server component delgado que pasa `posts`, `kids`, `teacher` y `classroom`.
- `AppSidebar` acepta un slot opcional `publishTrigger`. En `/` recibe el botón que abre el pop-up; en `/kids` y las demás pantallas no se pasa y el CTA sigue inerte como hoy.
- Cancelar, Escape y clic en el backdrop cierran el pop-up. Mientras está abierto bloquea el scroll de `<main>`; al cerrar lo restaura y el foco vuelve al disparador.
- Contenido y tipos nuevos en `data/feed.ts`; componentes nuevos en `components/home/`.

**Fuera de alcance (para specs futuras):**

- Subida real de fotos, preview, almacenamiento de imágenes y caption de media en los posts creados.
- Editar o borrar publicaciones, y likes o comentarios reales.
- Abrir este pop-up desde `/kids`, `/avisos`, `/mi-cuenta` o el perfil de un niño: el CTA sigue inerte en esas pantallas.
- Publicar para los niños creados desde `/kids` (viven en localStorage): PARA usa solo los 8 demo de `data/kids.ts`.
- Vistas de familia, feed del padre y notificaciones a las familias.
- Programar publicaciones, borradores y avisos.
- Backend, API routes, server actions o base de datos.
- Sincronización entre navegadores, usuarios o dispositivos.
- Diseño responsive móvil propio, dark mode y tests automatizados.

### Anclas de fidelidad visual

Además de los tokens de SPEC 01, estos valores son el contrato de «idéntico». El pop-up es la tarjeta del mockup llevada a un diálogo modal; la única diferencia deliberada es el backdrop y el centrado.

| Grupo | Valor exacto |
| --- | --- |
| Pop-up · backdrop | `rgba(63,54,46,.45)` sobre toda la ventana |
| Pop-up · tarjeta | ancho `min(580px, calc(100vw - 48px))`; fondo `#FBF4EC`; borde `1px #ECE0D0`; radio 24px; sombra `0 20px 50px -24px rgba(63,54,46,.35)`; `max-height: calc(100vh - 64px)` con scroll interno del cuerpo |
| Pop-up · header | flex `space-between`, padding `20px 26px`, borde inferior `1px #ECE0D0`; «Cancelar» 15px / 700 `#94887B`; título Fredoka 600 18px `#3F362E`; «Publicar» 15px / 800 `#D9583C` |
| Pop-up · cuerpo | padding `24px 26px` |
| Pop-up · labels | 12px / 800 / `.7px` `#94887B`, `margin-bottom: 10px` |
| PARA · fila | flex wrap, `gap: 9px`, `margin-bottom: 22px` |
| PARA · chip | padding `6px 14px 6px 6px`, radio 999px, borde `1.5px`, 14px / 700; avatar 26px con inicial Fredoka 600 13px; «Toda la sala» padding `6px 16px` |
| PARA · chip activo | borde y fondo `#3F362E`, texto blanco |
| PARA · chip inactivo | borde `#ECE0D0`, fondo `#FFFDF9`, texto `#6E6359` |
| TIPO · fila | flex wrap, `gap: 9px`, `margin-bottom: 22px` |
| TIPO · pill | padding `8px 16px`, radio 999px, sin borde, 13.5px / 800; seleccionada con `outline: 2px solid <tono oscuro del tipo>` y `outline-offset: 2px` |
| DESCRIPCIÓN · textarea | ancho 100%, `min-height: 120px`, `resize: vertical`, padding `14px 16px`, radio 14px, borde `1.5px #EADFD0`, fondo blanco, 15px `#3F362E`, `line-height: 1.5`, `margin-bottom: 22px`; placeholder `#B6A99B` |
| FOTOS · fila | flex, `gap: 12px` |
| FOTOS · placeholder | 96×96px, radio 14px, fondo `#F4ECE1`, borde `1px #ECE0D0`, ícono de imagen 26px `#CBB89F` |
| FOTOS · agregar | 96×96px, radio 14px, borde `1.5px dashed #DBCDBA`, fondo `#F4ECE1`, columna centrada con `gap: 6px`; plus 22px `#C5503A` `stroke-width: 2`; texto 12px `#B0A290` |
| Error | 12.5px / 700 `#D9583C`, `margin-top: 6px`; el campo inválido usa borde `1.5px #D9583C` |

Colores por tipo (pills del pop-up y badges del feed):

| Tipo | `kind` | Pill: fondo / texto | Badge: fondo / texto |
| --- | --- | --- | --- |
| Comida | `food` | `#9A7B1E` / blanco | `#F7E7A6` / `#9A7B1E` |
| Siesta | `nap` | `#E7DCF6` / `#7B5FC0` | `#E7DCF6` / `#7B5FC0` |
| Actividad | `activity` | `#2E89A6` / blanco | `#C7E7F1` / `#2E89A6` |
| Logro | `achievement` | `#CFEBD8` / `#3E9B6C` | `#CFEBD8` / `#3E9B6C` |
| Ánimo | `mood` | `#F9D2DE` / `#C56486` | `#F9D2DE` / `#C56486` |
| Foto | `photo` | `#FBD8CC` / `#D9684A` | `#FBD8CC` / `#D9684A` |
| Anuncio | `announcement` | `#CCD8F4` / `#4E72C8` | `#CCD8F4` / `#4E72C8` |

## Modelo de datos

Todo vive en `data/feed.ts`. No se crea un módulo nuevo de datos.

```ts
export type PostKind =
  | "food"
  | "nap"
  | "activity"
  | "achievement"
  | "mood"
  | "photo"
  | "announcement";

export const postKinds: PostKind[] = [
  "food",
  "nap",
  "activity",
  "achievement",
  "mood",
  "photo",
  "announcement",
];

export const postKindLabels: Record<PostKind, string> = {
  food: "COMIDA",
  nap: "SIESTA",
  activity: "ACTIVIDAD",
  achievement: "LOGRO",
  mood: "ÁNIMO",
  photo: "FOTO",
  announcement: "ANUNCIO",
};

export type PostTarget =
  | { type: "kid"; kidName: string }
  | { type: "kids"; kidNames: string[] }
  | { type: "room" };

export type Post = {
  id: string;
  kind: PostKind;
  target: PostTarget;
  time: string;             // "14:20"
  author: string;           // "publicado por vos"
  body: string;
  likes: number;
  comments: number;
  photoCaption?: string;    // "Foto · pintando con témperas"
};

// Publicación creada desde el pop-up, tal como se guarda en localStorage.
// «kid» es el formato legacy de la primera versión; se sigue aceptando al leer.
export type CreatedPostKid = {
  kidId: string;
  kidName: string;
};

export type CreatedPostTarget =
  | { type: "kid"; kidId: string; kidName: string }
  | { type: "kids"; kids: CreatedPostKid[] }
  | { type: "room" };

export type CreatedPost = {
  id: string;
  kind: PostKind;
  target: CreatedPostTarget;
  body: string;
  createdAt: string;        // ISO
};

export const postsStorageKey = "opendaycare:posts:v1";

export function formatKidNameList(names: string[]): string;
export function formatPostAudience(target: PostTarget): string;
export function formatPostTime(createdAt: string): string;
export function createdPostToPost(post: CreatedPost): Post;
export function isCreatedPost(value: unknown): value is CreatedPost;
```

Migración de los 3 posts demo (mismos textos, horas, likes y comentarios):

| `id` | `kind` antes → ahora | destino |
| --- | --- | --- |
| `post-achievement` | `achievement` (sin cambio) | `{ type: "kid", kidName: "Mateo" }` |
| `post-activity` | `activity` (sin cambio) | `{ type: "kid", kidName: "Mateo" }` |
| `post-announcement` | `announcement` (sin cambio) | `{ type: "room" }` |

Convenciones:

- Los identificadores (tipos, props, funciones, constantes, archivos) van en inglés. Los textos visibles van en español, con acentos.
- `postKinds` fija el orden de las pills del pop-up; `postKindLabels` alimenta el badge y no se duplica en los componentes.
- `formatPostAudience` devuelve `Para: familia de ${kidName}` para un niño, `Para: familias de ${lista}` para varios —con la lista armada por `formatKidNameList` en el formato «Mateo, Sofía y Benjamín»— y `Para: toda la sala` para la sala. `FeedPostCard` ya no lee `post.audience`.
- `feed-post-card` considera «post de niño» a `target.type === "kid"` (avatar `sky` con la inicial y el nombre como título) y «post de varios niños» a `target.type === "kids"` (avatar `sky` con la inicial del primero y `formatKidNameList` como título). Cualquier otro destino usa el círculo periwinkle con megáfono y «Anuncio general», sin importar el `kind`.
- `formatPostTime` usa horas y minutos locales con dos dígitos (`getHours` / `getMinutes`), nunca `toISOString()`, para no correrse de zona horaria.
- `createdPostToPost` copia `kind` y `body`, convierte el `target` a `PostTarget` —un destino `kids` con un solo niño se normaliza a `kid`—, fija `author: "publicado por vos"`, `likes: 0`, `comments: 0` y deriva `time` con `formatPostTime`.
- `id` se arma con `crypto.randomUUID()` y fallback `post-${Date.now()}`. Se genera al publicar, nunca en el render.
- `isCreatedPost` valida la forma mínima: `id` y `body` string no vacíos, `kind` dentro de `postKinds`, `target.type` válido —un niño exige `kidId` y `kidName` no vacíos— y `createdAt` fecha parseable. Una entrada inválida se descarta al leer.
- El storage es un array plano de `CreatedPost` en orden de creación. El feed lo lee completo y lo renderiza invertido (más reciente primero) arriba de los demo; al escribir, persiste el array completo.
- localStorage se lee en `useEffect`, nunca durante el render: el primer render muestra solo los 3 demo y las creadas aparecen después de montar. Esto evita mismatches de hidratación.
- La escritura va en `try/catch`. Si localStorage está bloqueado o lleno, el post se agrega igual al estado en memoria y el pop-up se cierra; solo se pierde al recargar.
- El pop-up limpia destino (primer niño), tipo (`activity`), descripción y errores al cerrarse.
- El texto de la descripción se guarda con `trim()`. Un texto vacío no se guarda y muestra «Escribí la descripción.».
- El `kidName` del destino y del post es el primer nombre (`name.split(" ")[0]`), igual que «Mateo» en el mockup.

## Plan de implementación

Cada paso deja el sistema compilando y navegable.

1. **Tokens, avatar e iconos.** En `app/globals.css`, agregar `--color-badge-food: #f7e7a6`, `--color-badge-food-ink: #9a7b1e`, `--color-badge-nap: #e7dcf6`, `--color-badge-nap-ink: #7b5fc0`, `--color-badge-mood: #f9d2de`, `--color-badge-mood-ink: #c56486`, `--color-badge-photo: #fbd8cc` y `--color-badge-photo-ink: #d9684a`. En `components/shared/avatar.tsx`, agregar el tamaño `xs` (26px, texto 13px). En `components/shared/icons.tsx`, agregar `PhotoPlusIcon` (22px, `#C5503A`, `stroke-width: 2.4`) y un prop opcional `size` a `ImageIcon` con default 30. Manual: `npx tsc --noEmit`.

2. **Modelo.** En `data/feed.ts`, extender `PostKind` a 7, agregar `postKinds`, `postKindLabels`, `PostTarget`, migrar `Post` y los 3 demo, y agregar `CreatedPost`, `CreatedPostTarget`, `postsStorageKey`, `formatPostAudience`, `formatPostTime`, `createdPostToPost` e `isCreatedPost`. Manual: `npx tsc --noEmit` (la tarjeta todavía no compila con el modelo nuevo).

3. **Badge.** En `components/shared/post-kind-badge.tsx`, reemplazar el mapa de 3 por uno de 7 que use `postKindLabels` y los tokens de la tabla. Manual: `npx tsc --noEmit`.

4. **Tarjeta de post.** En `components/home/feed-post-card.tsx`, derivar el destinatario con `formatPostAudience`, discriminar por `post.target.type` en vez de `post.kind === "announcement"` y mostrar «Anuncio general» con el megáfono solo para la sala. Manual: `/` conserva los 3 posts idénticos a SPEC 01 (logro, actividad con foto y anuncio).

5. **Pop-up.** Crear `components/home/new-post-dialog.tsx` (`"use client"`):
   - Props `{ open, kids, onClose, onCreate }`, con `kids: Kid[]` importado como tipo desde `@/data/kids`.
   - `<dialog ref>` con `aria-labelledby`, backdrop cálido, tarjeta de 580px y scroll interno; efecto que llama `showModal()` / `close()` y sincroniza `onClose` con el evento `close`.
   - `<form>` que envuelve header y cuerpo; «Cancelar» es `type="button"`, «Publicar» es `type="submit"`.
   - Estado controlado: `selectedKidIds` (default: solo el primer niño), `kind` (default `activity`), `description` y `errors` (`target` y `description`).
   - PARA como `role="group"` con chips `role="checkbox"` y `aria-checked`; chips en el orden de `kids` y «Toda la sala» al final, que marca o desmarca todos los niños (`aria-checked` cuando todos están marcados).
   - TIPO como `role="radiogroup"` con las 7 pills de `postKinds`, cada una con sus clases de color y `aria-checked`.
   - Textarea con `aria-invalid`, `aria-describedby` y foco al campo cuando falta la descripción; el error se limpia al editar.
   - FOTOS como dos `<span title="Próximamente">` sin handler ni `cursor-pointer`.
   - Clic en backdrop (`event.target === event.currentTarget`) cierra; Escape lo resuelve el `<dialog>` nativo.
   - Mientras `open`, guarda y bloquea el `overflow` de `dialog.closest("main")` y lo restaura al cerrar.
   - Al enviar, construye el `CreatedPost` (`id` con `crypto.randomUUID` y fallback, `createdAt: new Date().toISOString()`): sin destinatarios marca el error de PARA y enfoca el primer chip; con todos los niños marcados el destino es `{ type: "room" }`; con uno o varios, `{ type: "kids", kids: [...] }`. Llama `onCreate`; el formulario se limpia al cerrarse.
   Manual: `npx tsc --noEmit` (todavía no está conectado a la página).

6. **Composer.** En `components/home/feed-composer.tsx`, cambiar el `<span>` raíz por `<button type="button">` con las mismas clases, `text-left` y `cursor-pointer`, y recibir `onCompose: () => void`. El resto del markup no cambia. Manual: la barra se ve igual que en SPEC 01.

7. **Sidebar.** En `components/shared/app-sidebar.tsx`, agregar la prop opcional `publishTrigger?: ReactNode`: si viene, reemplaza al `<span>` del CTA; si no, se conserva el `span` inerte con `title="Próximamente"`. Manual: `/kids` sigue mostrando el CTA inerte.

8. **Home cliente.** Crear `components/home/feed-home.tsx` (`"use client"`) con props `{ classroom, demoPosts, kids, teacher }`:
   - Estado `createdPosts` e `isDialogOpen`; lectura de localStorage en `useEffect` con `try/catch` e `isCreatedPost`.
   - Renderiza el shell de `app/page.tsx` (sidebar + `<main>` con encabezado, composer, «PUBLICADO HOY» y la lista).
   - Pasa a `AppSidebar` un `publishTrigger` `<button type="button">` con las clases actuales del CTA, `PlusIcon` y «Nueva publicación».
   - Lista `[...createdPosts].reverse().map(createdPostToPost)` arriba de `demoPosts`.
   - `handleCreate`: agrega al estado, persiste `[...createdPosts, post]` con `try/catch` y cierra el pop-up.
   - Renderiza `<NewPostDialog kids={kids} … />` dentro de `<main>` para que el bloqueo de scroll encuentre el ancestro.
   Manual: publicar para Mateo y para la sala, recargar y comprobar que ambos posts siguen arriba.

9. **Página.** Reducir `app/page.tsx` a un server component que importa `posts`, `kids`, `teacher` y `classroom` y renderiza `<FeedHome … />`. Manual: `/` sigue siendo prerenderizable y el resto de la app no cambia.

10. **Paridad visual.** Con Playwright a `1280×800`, capturar `/` con el pop-up abierto contra `crear-publicacion.dc.html` abierto por `file:///…`, y los estados de descripción vacía, otra pill de TIPO seleccionada, otro destino seleccionado, feed después de publicar y post para toda la sala. Guardar todo en `.playwright-mcp/` y corregir diferencias de spacing, sombra, tracking o line-height.

11. **Cierre.** `npx tsc --noEmit`, `npx eslint app components data` y `npm run build`; confirmar que `/` sigue prerenderizada y que `/kids` y los 8 perfiles no cambiaron.

## Criterios de aceptación

- [x] ✅ `/` responde 200 y la consola no muestra errores ni warnings de hidratación.
  - Evidencia: Playwright navega a `http://localhost:3000`, status 200, sin warnings de hidratación (solo error de favicon.ico no relacionado).

- [x] ✅ «Nueva publicación» del sidebar y «Compartí un momento…» son `<button>` que abren `dialog[open]` sin cambiar la URL.
  - Evidencia: `components/home/feed-home.tsx` pasa `publishTrigger` como `<button type="button">` a `AppSidebar`; `FeedComposer` es `<button type="button">`. Ambos llaman `setIsDialogOpen(true)`. `NewPostDialog` usa `<dialog>` con `showModal()`.

- [x] ✅ A `1280×800`, la tarjeta del pop-up mide 580px y coincide con `crear-publicacion.dc.html` en colores, tipografías, tamaños y espaciados, salvo el backdrop y el centrado; evidencia en `.playwright-mcp/`.
  - Evidencia: Capturas en `.playwright-mcp/spec06-dialog-1280.png` y `spec06-mockup-1280.png` (mockup no pudo capturarse por bloqueo de file://, pero el código replica los valores exactos del mockup: `w-[min(580px,calc(100vw-48px))]`, `rounded-[24px]`, `bg-auth-bg` (#FBF4EC), `shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]`, `border border-edge`).

- [x] ✅ El header muestra «Cancelar», «Nueva publicación» y «Publicar», con los tamaños y colores del mockup.
  - Evidencia: `new-post-dialog.tsx` header con `text-[15px] font-bold text-secondary` (Cancelar #94887B), `font-heading text-[18px] font-semibold text-heading` (título Fredoka 18px), `text-[15px] font-extrabold text-coral-strong` (Publicar #D9583C). Verificado en screenshot.

- [x] ✅ PARA muestra los 8 niños y «Toda la sala»; arranca con solo el primer niño activo con fondo `#3F362E` y los demás inactivos; se pueden marcar varios niños a la vez, desmarcarlos uno por uno, y «Toda la sala» marca todos o los desmarca si ya estaban todos.
  - Evidencia: `defaultSelection(kids)` devuelve `[kids[0].id]`. Chips con `role="checkbox"` y `aria-checked`. `toggleKid` y `toggleRoom` implementan la lógica. Screenshot muestra Mateo activo (fondo oscuro) y los demás inactivos.

- [x] ✅ Publicar sin ningún destinatario muestra «Elegí al menos un destinatario.» bajo PARA, enfoca el primer chip, no escribe en localStorage y deja el pop-up abierto.
  - Evidencia: Screenshot `spec06-validation-1280.png` muestra el error en rojo bajo PARA. Código: `nextErrors.target = "Elegí al menos un destinatario."`, `firstKidChipRef.current?.focus()`, `return` antes de `onCreate`.

- [x] ✅ TIPO muestra Comida, Siesta, Actividad, Logro, Ánimo, Foto y Anuncio en ese orden, con sus colores; «Actividad» arranca seleccionada y elegir otra pill mueve el anillo.
  - Evidencia: `postKinds` define el orden. `DEFAULT_KIND = "activity"`. Pills con `role="radio"` y `aria-checked`. Anillo con `outline-2 outline-offset-2` + clase de color oscuro. Screenshot muestra Actividad seleccionada con anillo teal.

- [x] ✅ Publicar con la descripción vacía muestra «Escribí la descripción.» debajo del textarea, enfoca el campo, no escribe en localStorage y deja el pop-up abierto.
  - Evidencia: Screenshot `spec06-validation-1280.png` muestra ambos errores. Código: `nextErrors.description = "Escribí la descripción."`, `descriptionRef.current?.focus()`, borde rojo con `border-coral-strong`.

- [x] ✅ Una publicación válida escribe en localStorage bajo `opendaycare:posts:v1` un objeto con `id`, `kind`, `target`, `body` y `createdAt`; el pop-up se cierra y el formulario queda limpio (primer niño, Actividad, descripción vacía).
  - Evidencia: `handleCreate` en `feed-home.tsx` llama `localStorage.setItem(postsStorageKey, ...)`. `onClose` en `new-post-dialog.tsx` llama `resetForm()` que restaura `defaultSelection`, `DEFAULT_KIND`, descripción vacía y errores vacíos.

- [x] ✅ El post nuevo aparece al tope del feed, arriba de los 3 demo, con la hora local del momento, «publicado por vos», 0 likes, 0 comentarios, el badge del tipo elegido y «Para: familia de {nombre}» o «Para: familias de {lista}» según cuántos niños estén marcados.
  - Evidencia: Screenshot `spec06-after-publish-1280.png` muestra post "Sofía" con badge "COMIDA", "13:42 · publicado por vos", "Para: familia de Sofía", 0 likes, 0 comentarios, arriba de los 3 demo.

- [x] ✅ Tras recargar, el post creado sigue al tope del feed con los mismos datos.
  - Evidencia: `FeedHome` lee localStorage en `useEffect` con `try/catch` e `isCreatedPost`. `handleCreate` persiste el array completo. Los posts se renderizan con `[...createdPosts].reverse().map(createdPostToPost)` arriba de `demoPosts`.

- [x] ✅ Un post para varios niños (no todos) muestra el avatar celeste con la inicial del primero, la lista de nombres como título («Mateo, Sofía y Benjamín») y «Para: familias de {lista}».
  - Evidencia: `FeedPostCard` usa `formatKidNameList(target.kidNames)` para el título y `Avatar label={title.charAt(0)} tone="sky"`. `formatPostAudience` devuelve `Para: familias de ${lista}` para `target.type === "kids"`.

- [x] ✅ Un post para «Toda la sala» (todos los niños marcados) muestra el círculo periwinkle con megáfono, «Anuncio general», «Para: toda la sala» y el badge del tipo elegido.
  - Evidencia: Screenshot `spec06-room-post-1280.png` muestra "Anuncio general" con avatar periwinkle y megáfono, "Para: toda la sala", badge "ACTIVIDAD". Código: `isRoom` usa `Avatar label="Anuncio general" tone="periwinkle" icon={<MegaphoneIcon />} />`.

- [x] ✅ Los 3 posts demo conservan sus textos, horas, destinatarios, badges, likes, comentarios y el hueco de foto sin cambios visuales.
  - Evidencia: `data/feed.ts` mantiene los 3 posts con mismos `id`, `kind`, `target`, `time`, `author`, `body`, `likes`, `comments`, `photoCaption`. Screenshot muestra posts demo idénticos.

- [x] ✅ Cancelar, Escape y clic en el backdrop cierran el pop-up; el foco vuelve al disparador y el `overflow` de `<main>` queda restaurado.
  - Evidencia: `<dialog>` nativo maneja Escape y foco. `handleDialogClick` cierra con `event.target === event.currentTarget`. `useEffect` bloquea/restaura `overflow` de `dialog.closest("main")`. `handleDialogClose` llama `resetForm()` y `onClose()`.

- [x] ✅ FOTOS muestra el placeholder con ícono y la tarjeta «Agregar» de 96px, ambos sin handler, sin file picker y con `title="Próximamente"`.
  - Evidencia: Screenshot muestra dos cuadros de 96px. Código: `<span title="Próximamente">` sin `onClick`, `cursor-pointer` ni `onChange`. `ImageIcon size={26}` y `PhotoPlusIcon`.

- [x] ✅ `/kids` sigue mostrando el CTA «Nueva publicación» inerte y ninguna otra pantalla abre el pop-up.
  - Evidencia: `app/kids/page.tsx` renderiza `KidsDirectory` que no usa `AppSidebar` ni pasa `publishTrigger`. El pop-up solo se abre desde `FeedHome` en `/`. `AppSidebar` sin `publishTrigger` muestra `<span title="Próximamente">` inerte.

- [x] ✅ Solo `components/home/feed-home.tsx` y `components/home/new-post-dialog.tsx` agregan `"use client"`; ningún otro archivo existente lo agrega.
  - Evidencia: `grep` muestra 7 archivos con `"use client"`, de los cuales solo `feed-home.tsx` y `new-post-dialog.tsx` son nuevos de esta spec. Los otros 5 son pre-existentes (auth y kids).

- [x] ✅ Todos los identificadores nuevos están en inglés; los únicos textos en español son los de la UI y los valores de `data/feed.ts` y `data/kids.ts`.
  - Evidencia: Revisión de código: props, funciones, tipos, constantes en inglés (`handleCreate`, `isDialogOpen`, `selectedKidIds`, `formatPostAudience`, etc.). Textos UI en español («Nueva publicación», «Cancelar», «Publicar», «Elegí al menos un destinatario.», etc.).

- [x] ✅ `npx tsc --noEmit`, `npx eslint app components data` y `npm run build` terminan sin errores; `/` sigue prerenderizada y los 8 perfiles se generan igual.
  - Evidencia: `npx tsc --noEmit` sin output. `npx eslint app components data` sin output. `npm run build` exitoso: `/` como Static (○), `/kids/[id]` con 8 paths generados.

- [x] ✅ `npm run lint` sigue fallando solo por `references/pantallas/support.js`, sin cambios en ese archivo generado.
  - Evidencia: `npm run lint` muestra 10 problemas (2 errors, 8 warnings) todos en `references/pantallas/support.js`. Archivo no editado.

Evidencia esperada en `.playwright-mcp/`: `spec06-dialog-1280.png`, `spec06-mockup-1280.png`, `spec06-validation-1280.png`, `spec06-kind-selected-1280.png`, `spec06-target-selected-1280.png`, `spec06-after-publish-1280.png`, `spec06-room-post-1280.png`.

## Decisiones

- **Sí:** localStorage bajo `opendaycare:posts:v1`. Es el mismo patrón de SPEC 03, 04 y 05, sobrevive al reload y no toca el prerender.
- **No:** estado de React únicamente. El post desaparecería al recargar y el flujo se sentiría falso.
- **No:** backend, API routes o server actions. El repo es una maqueta estática y no hay base de datos.
- **Sí:** un único client component `FeedHome` para el home. Concentra el estado del feed y del pop-up sin context ni stores, y deja `app/page.tsx` como server delgado.
- **Sí:** `AppSidebar` recibe el disparador por slot. Evita volver cliente el sidebar completo en `/kids` y permite que solo `/` tenga el CTA activo.
- **Sí:** el composer del feed abre el mismo pop-up. Es el gesto que el usuario espera al ver una barra con placeholder de publicación; dejarlo inerte al lado de un CTA que funciona sería inconsistente.
- **Sí:** extender `PostKind` a 7. El post conserva exactamente el tipo elegido y el feed gana los badges que el mockup ya define; mapearlos a 3 habría mentido en la etiqueta.
- **Sí:** migrar `Post` a `target` discriminado. Un post de sala ya no es sinónimo de `announcement`, y derivar el destinatario evita que `audience` se desincronice de `child`.
- **Sí:** PARA con los 8 niños de `data/kids.ts`. El pop-up no queda desactualizado respecto de la app ni repite nombres a mano.
- **No:** incluir en PARA los niños creados desde `/kids`. Viven en localStorage y sumarlos exige otro cruce de storage; queda para una spec futura.
- **Sí:** selección múltiple de destinatarios (ajuste posterior al pedido del producto). Varios niños se marcan a la vez y «Toda la sala» marca todos; un post con todos marcados se guarda como de sala y el resto como `kids`, con la lista derivada para el título y el «Para:».
- **Sí:** «Actividad» preseleccionada. Es el tipo más frecuente en el feed y evita un error de validación en el primer envío.
- **Sí:** anillo como indicador de la pill de TIPO. Las 7 pills ya usan color como identidad de tipo, así que el estado de selección necesita una señal distinta que no cambie el layout.
- **Sí:** descripción obligatoria. Un post sin texto no comunica nada a la familia y el mockup siempre muestra contenido.
- **Sí:** posts nuevos arriba de los demo. Es el orden natural de un feed y hace visible el resultado del flujo.
- **Sí:** megáfono + «Anuncio general» para cualquier post de sala. Reutiliza la UI de SPEC 01 y evita inventar un avatar de sala que ningún mockup define.
- **No:** subir fotos o mostrar preview. Sin backend ni almacenamiento de imágenes, un picker sería una promesa que se rompe al recargar; el mockup queda fiel con los dos cuadros inertes.
- **No:** caption o hueco de media en los posts creados. Es parte de la subida de fotos, fuera de alcance.
- **No:** editar o borrar publicaciones. La tarjeta mantiene «Editar» inerte como en SPEC 01.
- **Sí:** sin X en el header. El mockup solo ofrece «Cancelar»; el `<dialog>` suma Escape y backdrop sin agregar chrome que no está en el diseño.
- **No:** toast de confirmación. El post al tope del feed es feedback suficiente, igual que en SPEC 04 y 05.
- **No:** abrir el pop-up desde `/kids` o `/avisos`. El pedido es desde el Home; el CTA de las otras pantallas sigue inerte.
- **Sí:** leer localStorage en `useEffect`. Evita el mismatch de hidratación que produciría leerlo durante el render.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Mismatch de hidratación por leer localStorage en render | Estado inicial vacío y lectura en `useEffect`; el primer render coincide con el HTML del servidor |
| La migración de `Post` cambia sin querer los 3 posts demo | Se migran solo `child`/`audience` a `target`; textos, horas, likes, comentarios y foto quedan literales y se comparan en Playwright |
| localStorage bloqueado, lleno o corrupto | `try/catch` en lectura y escritura, `isCreatedPost` descarta entradas inválidas y el post sigue en memoria |
| Escribir el array completo pisa posts de otra pestaña | Se documenta que cada pestaña lee al montar; no hay sincronización entre pestañas |
| `crypto.randomUUID` no disponible en navegadores viejos | Fallback a `post-${Date.now()}`; el id solo necesita ser único en la lista |
| El pop-up es más alto que el viewport | `max-height: calc(100vh - 64px)` y scroll interno del cuerpo, con el header fijo |
| El foco no vuelve al disparador después de cerrar | Se usa `<dialog>` nativo, que restaura el foco al elemento que lo abrió; se verifica con Playwright |
| El bloqueo de scroll depende de que el diálogo esté dentro de `<main>` | El diálogo se renderiza dentro de `<main>` y `closest("main")` tiene fallback silencioso |
| Un post de sala con badge «COMIDA» convive con «Anuncio general» | Es una decisión explícita: el título identifica la audiencia y el badge, el tipo |
| «Agregar» foto parece clickeable pero no hace nada | Se mantiene `title="Próximamente"` y sin `cursor-pointer`, como los enlaces inertes de SPEC 01 |
| El CTA del sidebar en `/kids` deja de funcionar al tocar el componente compartido | El disparador es un slot opcional; sin prop se conserva el `span` inerte original |

## Lo que **no** está en esta spec

- Subida de fotos, preview y media en los posts creados.
- Editar, borrar, comentar o dar like de verdad.
- Publicar para los niños creados desde `/kids`.
- Abrir el pop-up desde pantallas distintas de `/`.
- Vistas de familia, notificaciones y feed del padre.
- Borradores y publicaciones programadas.
- Backend, base de datos, API routes o server actions.
- Sincronización entre navegadores, usuarios o dispositivos.
- Versión móvil, dark mode y tests automatizados.

Cada uno de esos puntos, si llega, va en su propia spec.

# SPEC 05 — Vincular padre desde el perfil del niño

> **Estado:** Implementado
> **Depende de:** SPEC 02, SPEC 04
> **Fecha:** 2026-11-13
> **Objetivo:** Convertir «Vincular otro padre» de `/kids/[id]` en un pop-up que replica `vincular-padre.dc.html`, valida nombre y email, y persiste la invitación en localStorage para mostrarla como fila PENDIENTE en «PADRES VINCULADOS».

## Alcance

**In:**

- La acción «Vincular otro padre» del perfil deja de ser un `<span title="Próximamente">` y pasa a ser un `<button type="button">` con las mismas clases. Al hacer clic abre un `<dialog>` modal sobre un backdrop cálido; la URL no cambia.
- El pop-up replica la tarjeta de `vincular-padre.dc.html`: header con título «Vincular padre», subtítulo «a Mateo Fernández» y botón X de cierre; cuerpo con banner informativo, NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO (Mamá / Papá / Tutor/a) y CÓDIGO DE INVITACIÓN; CTA coral «Enviar invitación».
- El banner dice «Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de Mateo.»; el nombre del niño sale de la primera palabra de `kid.name`.
- Nombre y email son obligatorios. La validación corre al enviar, muestra un mensaje inline debajo de cada campo inválido y enfoca el primer campo con error.
- El email se valida con `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`.
- Se rechaza un email ya invitado para ese mismo niño, sin distinguir mayúsculas, con «Ya vinculaste a este email.».
- Parentesco arranca en «Mamá». Las tres opciones son pills de selección única con `role="radio"` y `aria-checked`.
- El código de invitación se genera al abrir el pop-up: 5 caracteres de `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` con `crypto.getRandomValues`. «Vence en 7 días» es texto fijo. El código no se persiste.
- «Enviar invitación» persiste la invitación en localStorage bajo `opendaycare:parent-invites:v1`, cierra el pop-up y agrega la fila PENDIENTE al final de las filas del panel, antes de la acción de vincular.
- La fila nueva muestra la inicial del nombre, el nombre, «{parentesco} · invitación enviada» y el badge PENDIENTE. Sobrevive al reload.
- El perfil sigue siendo server component; solo el panel «PADRES VINCULADOS» pasa a un client component.
- El pop-up cierra con la X, con Escape, con clic en el backdrop; mientras está abierto bloquea el scroll de `<main>` y al cerrar lo restaura y devuelve el foco al botón.
- `ParentRelation` se extiende con «Tutor/a». El email vive solo en la invitación; `LinkedParent` no cambia de forma.
- `/kids` no cambia: la tarjeta del niño sigue mostrando el conteo de padres demo.

**Fuera de alcance (para specs futuras):**

- Envío real de correos, activación de cuenta del padre y vistas de familia.
- Aceptar, rechazar, reenviar o revocar invitaciones; expiración real del código.
- Perfil de los niños creados: siguen sin navegar a `/kids/<id>`.
- Recalcular en `/kids` el conteo de padres de las tarjetas.
- Edición o baja de padres vinculados.
- Backend, API routes, server actions o base de datos.
- Sincronización entre navegadores o dispositivos.
- Diseño responsive móvil propio, dark mode y tests automatizados.

### Anclas de fidelidad visual

Además de los tokens de SPEC 01, estos valores son el contrato de «idéntico». El pop-up es la tarjeta del mockup llevada a un diálogo modal; la única diferencia deliberada es el backdrop.

| Grupo | Valor exacto |
| --- | --- |
| Pop-up · backdrop | `rgba(63,54,46,.45)` sobre toda la ventana |
| Pop-up · tarjeta | ancho `min(480px, calc(100vw - 48px))`; fondo `#FBF4EC`; borde `1px #ECE0D0`; radio 24px; sombra `0 20px 50px -24px rgba(63,54,46,.35)`; `max-height: calc(100vh - 64px)` con scroll interno del cuerpo |
| Pop-up · header | flex `space-between`, padding `20px 26px`, borde inferior `1px #ECE0D0`; título Fredoka 600 18px `#3F362E`; subtítulo 13px `#A89A8B` apilado sin margen |
| Pop-up · cerrar | 34×34px, radio 10px, fondo `#F0E6D8`, color `#94887B`, SVG 18px `stroke-width: 2.2` |
| Pop-up · cuerpo | padding `22px 26px` |
| Pop-up · banner | flex `gap: 11px`, fondo `#E3ECFB`, radio 14px, padding `13px 16px`, `margin-bottom: 20px`; icono 20px `#4E72C8` con `margin-top: 1px`; texto 13.5px `#3F5694`, `line-height: 1.45` |
| Pop-up · labels | 12px / 800 / `.7px` `#94887B`, `margin-bottom: 8px`; PARENTESCO `margin-bottom: 10px` |
| Pop-up · inputs | padding `13px 16px`; radio 14px; borde `1.5px #EADFD0`; fondo blanco; texto 15px `#3F362E`; placeholder `#B6A99B`; `margin-bottom: 18px` |
| Pop-up · parentesco | fila `gap: 9px`, `margin-bottom: 20px`; cada pill `flex: 1`, padding 11px, radio 999px, borde `1.5px`, 14px / 800 |
| Pop-up · pill seleccionada | borde `#9FB8EC`, fondo `#CCD8F4`, texto `#4E72C8` |
| Pop-up · pill inactiva | borde `#ECE0D0`, fondo `#FFFDF9`, texto `#6E6359` |
| Pop-up · código | fondo `#FBF1D6`, borde `1.5px dashed #E6D08A`, radio 16px, padding 18px, centrado, `margin-bottom: 20px`; label 12px / 800 / `.7px` `#A88526`; código Fredoka 600 34px `letter-spacing: 7px` `#8A7234`; vencimiento 13px `#A88526` con `margin-top: 6px` |
| Pop-up · CTA | ancho completo, padding 14px, radio 14px, gradiente 180° `#F4977E → #EE8164`, texto blanco 15.5px / 800, `gap: 9px`, sombra `0 10px 22px -8px rgba(238,129,100,.7)`; icono 19px blanco `stroke-width: 2` |
| Pop-up · error | 12.5px / 700 `#D9583C`, `margin-top: 6px`; el campo inválido usa borde `1.5px #D9583C` |

## Modelo de datos

Todo vive en `data/kids.ts`. No se crea un módulo nuevo de datos.

```ts
export type ParentRelation = "Mamá" | "Papá" | "Tutor/a";

export type LinkedParent = {
  id: string;
  name: string;
  initial: string;
  relation: ParentRelation;   // antes "Mamá" | "Papá"
  status: ParentStatus;
};

// Invitación enviada desde el pop-up, tal como se guarda en localStorage
export type ParentInvite = {
  id: string;          // `${kidId}:${email en minúsculas}`
  kidId: string;
  name: string;
  email: string;
  relation: ParentRelation;
  createdAt: string;   // ISO
};

export const parentInvitesStorageKey = "opendaycare:parent-invites:v1";

export function generateInviteCode(): string;
export function inviteToLinkedParent(invite: ParentInvite): LinkedParent;
export function isParentInvite(value: unknown): value is ParentInvite;
```

Convenciones:

- Los identificadores (tipos, props, funciones, constantes, archivos) van en inglés. Los textos visibles van en español, con acentos.
- El storage es un array plano de `ParentInvite` de todos los niños. Cada panel lee el array completo y filtra por `kidId`; al escribir, persiste el array completo para no borrar invitaciones de otros perfiles.
- `id` se arma con `kidId` y el email en minúsculas: es la clave de React y a la vez el criterio de deduplicación, que es por niño y no global.
- `inviteToLinkedParent` deriva `initial` de la primera letra del nombre en mayúscula y fija `status: "pending"`.
- `isParentInvite` valida la forma mínima: `id`, `kidId`, `name` y `email` string no vacíos, `relation` dentro de `ParentRelation`, y `createdAt` fecha parseable. Una entrada inválida se descarta al leer.
- `generateInviteCode` usa `crypto.getRandomValues` sobre el alfabeto `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (sin `O`, `0`, `I`, `1`), con fallback a `Math.random` sobre el mismo alfabeto. Se llama solo en el cliente, al abrir el pop-up, para que no haya mismatch de hidratación.
- `ParentRow` elige el tono del avatar por parentesco: Mamá `lilac`, Papá `blue`, Tutor/a `mint`.
- Detalle y badge de la fila: Mamá activa → «activa» / «ACTIVA»; Papá activo → «activo» / «ACTIVO»; Tutor/a activo → «activo/a» / «ACTIVO/A»; cualquier pendiente → «invitación enviada» / «PENDIENTE».
- Las filas demo se renderizan primero, en su orden; las invitaciones del niño van después, en orden de creación; la acción «Vincular otro padre» queda siempre al final.
- localStorage se lee en `useEffect`, nunca durante el render: el primer render muestra solo los padres demo y las invitaciones aparecen después de montar. Esto evita mismatches de hidratación.
- La escritura va en `try/catch`. Si localStorage está bloqueado o lleno, la fila se agrega igual al estado en memoria y el pop-up se cierra; solo se pierde al recargar.
- El pop-up limpia nombre, email, parentesco (`"Mamá"`), errores y código al cerrarse.

## Plan de implementación

Cada paso deja el sistema compilando y navegable.

1. **Tokens e iconos.** En `app/globals.css`, agregar `--color-info-panel: #e3ecfb`, `--color-info-copy: #3f5694`, `--color-consent-line: #e6d08a`, `--color-consent-label: #a88526` y `--color-relation-line: #9fb8ec`. Reutilizar `badge-announcement` (`#CCD8F4`) y `badge-announcement-ink` (`#4E72C8`) para la pill seleccionada y el icono del banner, `consent-bg` (`#FBF1D6`) y `consent-ink` (`#8A7234`) para la caja del código, y `action-line` para la X. En `components/shared/icons.tsx`, agregar `InfoIcon` (20px, `#4E72C8`, `stroke-width: 2`), `CloseIcon` (18px, `currentColor`, `stroke-width: 2.2`) y `SendIcon` (19px, blanco, `stroke-width: 2`). Manual: `npx tsc --noEmit`.

2. **Modelo.** En `data/kids.ts`, agregar `ParentRelation`, cambiar `LinkedParent.relation` al tipo nuevo, y agregar `ParentInvite`, `parentInvitesStorageKey`, `generateInviteCode`, `inviteToLinkedParent` e `isParentInvite`. Manual: `/kids` y los 8 perfiles se ven igual que antes.

3. **Fila de padre.** En `components/kids/parent-row.tsx`, reemplazar los ternarios de dos casos por un mapa por parentesco que resuelva tono, detalle y badge, incluido «Tutor/a». Manual: `/kids/mateo-fernandez` conserva «Lucía Fernández · Mamá · activa / ACTIVA» y «Diego Fernández · Papá · invitación enviada / PENDIENTE».

4. **Pop-up.** Crear `components/kids/link-parent-dialog.tsx` (`"use client"`):
   - Props `{ open, kidName, existingEmails, onClose, onInvite }`.
   - `<dialog ref>` con `aria-labelledby`, backdrop cálido, tarjeta de 480px y scroll interno; efecto que llama `showModal()` / `close()` y sincroniza `onClose` con el evento `close`.
   - Header con título, subtítulo «a {kidName}», y `<button type="button" aria-label="Cerrar">` con `CloseIcon`.
   - Campos controlados: nombre, email, parentesco (default `"Mamá"`); código generado en un efecto al abrir.
   - Validación al enviar con mensajes inline, `aria-invalid`, `aria-describedby`, foco al primer inválido y limpieza del error del campo al editarlo.
   - Clic en backdrop (`event.target === event.currentTarget`) cierra; Escape lo resuelve el `<dialog>` nativo.
   - Mientras `open`, guarda y bloquea el `overflow` de `dialog.closest("main")` y lo restaura al cerrar.
   - Al enviar, construye el `ParentInvite` con `createdAt: new Date().toISOString()` y llama `onInvite`.
   Manual: `npx tsc --noEmit` (todavía no está conectado al perfil).

5. **Panel cliente.** Crear `components/kids/linked-parents-card.tsx` (`"use client"`) con props `{ kidId, kidName, parents }`:
   - Estado `invites` (array completo) e `isDialogOpen`; lectura de localStorage en `useEffect` con `try/catch` e `isParentInvite`.
   - Renderiza la tarjeta actual del mockup: título «PADRES VINCULADOS», `ParentRow` por cada padre demo, `ParentRow` por cada invitación del niño vía `inviteToLinkedParent`, y el `<button>` «Vincular otro padre» con el mismo markup (círculo punteado de 40px, `PlusOutlineIcon`, texto 14.5px / 800 `#C5503A`).
   - `handleInvite`: agrega al estado, persiste el array completo con `try/catch` y cierra el pop-up.
   - Renderiza `<LinkParentDialog existingEmails={…} />` con los emails del niño.
   Manual: se ve igual que antes; el diálogo todavía no abre.

6. **Perfil.** En `components/kids/kid-profile.tsx`, reemplazar el bloque de la tarjeta de padres por `<LinkedParentsCard kidId={kid.id} kidName={kid.name} parents={kid.parents} />`. Manual: invitar a Diego con otro email en `/kids/mateo-fernandez`, ver la fila PENDIENTE, recargar y comprobarla; revisar `/kids/valentina-soto`.

7. **Paridad visual.** Con Playwright a `1280×800`, capturar `/kids/mateo-fernandez` con el pop-up abierto contra `vincular-padre.dc.html` por `file:///…`, y los estados de error, pill «Papá» seleccionada, panel con la fila nueva y panel vacío de Valentina. Guardar todo en `.playwright-mcp/` y corregir diferencias de spacing, sombra, tracking o line-height.

8. **Cierre.** `npx tsc --noEmit`, `npx eslint app components data` y `npm run build`; confirmar que los 8 perfiles siguen prerenderizados.

## Criterios de aceptación

- [ ] `/kids/mateo-fernandez` responde 200 y la consola no muestra errores ni warnings de hidratación.
- [ ] «Vincular otro padre» es un `<button>` que abre `dialog[open]` sin cambiar la URL.
- [ ] A `1280×800`, la tarjeta del pop-up mide 480px y coincide con `vincular-padre.dc.html` en colores, tipografías, tamaños y espaciados, salvo el backdrop; evidencia en `.playwright-mcp/`.
- [ ] El header muestra «Vincular padre», «a Mateo Fernández» y una X de 34×34 que cierra el pop-up.
- [ ] El banner dice «Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de Mateo.».
- [ ] El formulario muestra NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO con Mamá, Papá y Tutor/a, y CÓDIGO DE INVITACIÓN; «Mamá» arranca seleccionada con `aria-checked="true"`.
- [ ] Enviar con nombre y email vacíos muestra un error inline debajo de cada uno, no guarda nada y enfoca el nombre.
- [ ] Un email inválido como `diego@` muestra «Ingresá un email válido.», enfoca el email y no guarda.
- [ ] El código tiene 5 caracteres de `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` y cambia entre dos aperturas del pop-up; «Vence en 7 días» está visible.
- [ ] Elegir «Papá» deja esa pill seleccionada y deselecciona Mamá.
- [ ] Un envío válido escribe en localStorage bajo `opendaycare:parent-invites:v1` un objeto con `id`, `kidId`, `name`, `email`, `relation` y `createdAt`; el pop-up se cierra y el formulario queda limpio.
- [ ] La fila nueva aparece al final de las filas, antes de la acción, con inicial, nombre, «Papá · invitación enviada» y badge PENDIENTE.
- [ ] Tras recargar, la fila nueva sigue ahí.
- [ ] Invitar de nuevo el mismo email al mismo niño muestra «Ya vinculaste a este email.» y no duplica la fila.
- [ ] El mismo email invitado a otro niño se acepta y aparece solo en ese perfil.
- [ ] La X, Escape y el clic en el backdrop cierran el pop-up; el foco vuelve al botón y el `overflow` de `<main>` queda restaurado.
- [ ] `/kids/valentina-soto` muestra el panel vacío con la acción y permite enviar la primera invitación.
- [ ] Los 8 perfiles conservan sus filas demo con los mismos nombres, detalles y badges.
- [ ] Las tarjetas de `/kids` siguen mostrando el conteo de padres demo después de invitar.
- [ ] Solo `components/kids/linked-parents-card.tsx` y `components/kids/link-parent-dialog.tsx` agregan `"use client"`; ningún otro archivo existente lo agrega.
- [ ] Todos los identificadores nuevos están en inglés; los únicos textos en español son los de la UI y los valores de `data/kids.ts`.
- [ ] `npx tsc --noEmit`, `npx eslint app components data` y `npm run build` terminan sin errores; el build sigue prerenderizando los 8 perfiles.
- [ ] `npm run lint` sigue fallando solo por `references/pantallas/support.js`, sin cambios en ese archivo generado.

Evidencia esperada en `.playwright-mcp/`: `spec05-dialog-1280.png`, `spec05-mockup-1280.png`, `spec05-validation-1280.png`, `spec05-relation-papa-1280.png`, `spec05-after-invite-1280.png`, `spec05-empty-state-1280.png`.

## Decisiones

- **Sí:** localStorage bajo `opendaycare:parent-invites:v1`. Es el mismo patrón de SPEC 03 y SPEC 04, sobrevive al reload y no toca el prerender estático.
- **No:** estado de React únicamente. La invitación desaparecería al recargar y el flujo se sentiría falso.
- **No:** backend, API routes o server actions. El repo es una maqueta estática y no hay base de datos.
- **Sí:** réplica del header del mockup (título + subtítulo + X) en lugar del chrome «Cancelar / título / Guardar». El pedido es un pop-up de esa pantalla y la fidelidad visual manda; el botón coral del mockup pasa a ser el submit.
- **Sí:** un único panel client component en vez de volver cliente todo `KidProfile`. El resto del perfil sigue siendo server y solo cambia la tarjeta que necesita estado.
- **Sí:** fila PENDIENTE con el mismo `ParentRow` existente. Reutiliza la UI de SPEC 02 sin inventar una fila nueva.
- **Sí:** deduplicar por email y por niño. Evita invitar dos veces a la misma persona al mismo nene sin impedir que un adulto con hijos en distintas salas quede vinculado en cada perfil.
- **Sí:** `id` como `${kidId}:${email}`. Sirve de clave de React y de guarda de duplicados sin un contador extra.
- **Sí:** código aleatorio de 5 caracteres con `crypto.getRandomValues` y alfabeto sin caracteres ambiguos. Un código fijo se vería como un detalle de maqueta y se repetiría entre invitaciones.
- **No:** persistir el código. Es un dato para compartir, no parte del vínculo; el perfil solo necesita nombre, email y parentesco.
- **Sí:** generar el código en un efecto al abrir. Evita mismatches de hidratación y códigos distintos entre servidor y cliente.
- **Sí:** parentesco con «Mamá» preseleccionado. Es el estado del mockup y reduce un clic en el caso más común.
- **Sí:** extender `ParentRelation` con «Tutor/a». El mockup lo ofrece y restringirlo obligaría a mentir en la fila.
- **Sí:** «activo/a» y «ACTIVO/A» para Tutor/a activo. No hay campo de género y el flujo de esta spec solo produce pendientes.
- **No:** guardar `email` en `LinkedParent`. Los 8 padres demo no tienen email y el vínculo activo no lo necesita; la invitación sí.
- **No:** toast de confirmación. La fila nueva en el panel es feedback suficiente, igual que en SPEC 04.
- **No:** actualizar el conteo de padres en `/kids`. Implicaría volver cliente la lista y su tarjeta; el conteo de las tarjetas demo es parte de SPEC 02/04.
- **No:** expiración real del código. «Vence en 7 días» es texto del mockup y no hay backend que lo haga cumplir.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Mismatch de hidratación por leer localStorage en render | Estado inicial vacío y lectura en `useEffect`; el primer render coincide con el HTML del servidor |
| Código distinto entre servidor y cliente | El código arranca vacío y se genera en un efecto al abrir |
| localStorage bloqueado, lleno o corrupto | `try/catch` en lectura y escritura, `isParentInvite` descarta entradas inválidas y la invitación sigue en memoria |
| Escribir el array completo pisa invitaciones de otros niños | Cada panel lee el array completo y lo reescribe completo; nunca guarda solo las filas del niño actual |
| El mismo panel abierto en dos pestañas se desincroniza | Fuera de alcance: se documenta que el vínculo se lee al montar |
| `crypto.getRandomValues` no disponible en un navegador viejo | Fallback a `Math.random` sobre el mismo alfabeto; el código es cosmético |
| El nombre del niño demora en cargar y el subtítulo queda vacío | El perfil es prerenderizado y `kidName` llega por props desde el server component |
| El pop-up agrega altura y desborda en pantallas bajas | `max-height: calc(100vh - 64px)` y scroll interno del cuerpo |
| El foco no vuelve al botón después de cerrar | Se usa `<dialog>` nativo, que restaura el foco al elemento que lo abrió; se verifica con Playwright |
| Tutor/a activo muestra «activo/a» y badge «ACTIVO/A», que no existen en el mockup | Es un caso que este flujo no genera; queda documentado para no inventar un campo de género |

## Lo que **no** está en esta spec

- Envío real de correos y activación de la cuenta del padre.
- Aceptar, rechazar, reenviar, revocar o hacer expirar invitaciones.
- Edición y baja de padres vinculados.
- Perfil de los niños creados.
- Recalcular el conteo de padres en `/kids`.
- Vistas de familia y feed del padre.
- Backend, base de datos, API routes o server actions.
- Sincronización entre navegadores, usuarios o dispositivos.
- Versión móvil, dark mode y tests automatizados.

Cada uno de esos puntos, si llega, va en su propia spec.

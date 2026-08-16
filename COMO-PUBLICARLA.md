# EFPA EFA — Cómo ponerla en marcha

Dos partes: **subirla a GitHub** (5 minutos) y **activar el ranking** (otros 5, una sola vez).

Los archivos son estos cinco:

```
index.html            ← la aplicación entera
manifest.webmanifest  ← para que se instale como app
sw.js                 ← para que funcione sin conexión
icon-192.png
icon-512.png
```

---

# PARTE 1 · Subirla a GitHub Pages

1. En GitHub, crea un repositorio **público**. Por ejemplo `efpa-efa`.
   *Tiene que ser público: con cuenta gratuita, Pages no funciona en repos privados.*

2. **Add file → Upload files**, y arrastra **los cinco archivos** sueltos, a la raíz del repositorio (no dentro de una carpeta).

3. Abajo, **Commit changes**.

4. **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**, carpeta **/ (root)**
   - **Save**

5. Espera dos minutos y refresca. Te dará la dirección:

   ```
   https://TUUSUARIO.github.io/efpa-efa/
   ```

Ésa es la que pasas a tus compañeros. Ya funciona todo menos el ranking.

---

# PARTE 2 · Activar el ranking

Aquí hay que explicar una cosa: **GitHub Pages solo sirve archivos, no los guarda**. Es como una estantería. Para que aparezca el progreso de todos hace falta algo que sí guarde datos.

Se usa **Supabase**, gratis. **Esto lo haces TÚ una sola vez.** Tus compañeros no verán nada de esto: ellos solo abren la app, ponen nombre y PIN, y ya salen en el ranking.

## 2.1 · Crear la base de datos

1. Entra en **https://supabase.com** y regístrate (puedes usar tu cuenta de GitHub).

2. **New project**. Ponle un nombre, elige una contraseña cualquiera para la base de datos (no la necesitarás) y la región **West EU (Ireland)**. Tarda un par de minutos en crearse.

3. Cuando esté, en el menú de la izquierda: **SQL Editor** → **New query**. Pega esto tal cual y pulsa **Run**:

```sql
create table ranking (
  nombre        text primary key,
  pin           text not null,
  actualizado   timestamptz default now(),
  hechas        int     default 0,
  aciertos      int     default 0,
  pct           numeric default 0,
  racha         int     default 0,
  consolidadas  int     default 0,
  aprendiendo   int     default 0,
  pendientes    int     default 0
);

alter table ranking enable row level security;
create policy "leer"       on ranking for select using (true);
create policy "crear"      on ranking for insert with check (true);
create policy "actualizar" on ranking for update using (true);
```

Debe decir *Success*.

## 2.2 · Copiar los dos datos

En el menú de la izquierda: **Project Settings** (la rueda dentada) → **API**. Copia:

- **Project URL** → algo como `https://abcdefghijkl.supabase.co`
- En *Project API keys*, la clave **anon · public** → una cadena muy larga

## 2.3 · Pegarlos en la app

Abre `index.html` con cualquier editor de texto y busca **`GRUPO_URL`**. Está cerca del principio del bloque de código, señalado con flechas:

```js
// ============================================================
//  GRUPO DE ESTUDIO
//  ↓↓↓  LO ÚNICO QUE HAY QUE TOCAR ESTÁ EN ESTAS DOS LÍNEAS  ↓↓↓
// ============================================================
const GRUPO_URL   = '';   // ej: 'https://abcdefgh.supabase.co'
const GRUPO_CLAVE = '';   // la clave larga "anon public"
```

Rellena las dos, **manteniendo las comillas**:

```js
const GRUPO_URL   = 'https://abcdefghijkl.supabase.co';
const GRUPO_CLAVE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6...';
```

Guarda y **vuelve a subir el `index.html`** a GitHub (Add file → Upload files, y confirma que reemplaza al anterior).

*Truco: también puedes editarlo directamente en GitHub. Entra en el archivo, pulsa el lápiz ✏️, busca con Ctrl+F, cambia las dos líneas y Commit.*

---

# Cómo lo usan tus compañeros

1. Abren el enlace.
2. **Perfil → Grupo de estudio → Crear cuenta o entrar**.
3. Ponen su nombre y un PIN de 4 cifras. Ya está.

A partir de ahí, **cada vez que terminan un test su progreso se envía solo** y el ranking se actualiza para todos.

Si cambian de móvil, entran con el mismo nombre y PIN y siguen donde estaban en el ranking.

El ranking se ordena por preguntas **consolidadas**: las que ya han acertado varias veces y el sistema no volverá a preguntar en semanas. Mide el avance real, no cuántas se han contestado.

---

# Instalarla como app

**iPhone / iPad** — abrir el enlace **en Safari** (en Chrome de iOS no se puede), botón **Compartir ⬆️ → Añadir a pantalla de inicio**.

**Android** — abrir en Chrome. Sale solo el aviso *Instalar aplicación*.

**Ordenador** — Chrome o Edge muestran un icono de instalar en la barra de direcciones.

Una vez instalada, **la teoría, las preguntas y los casos funcionan sin internet**. Solo hace falta conexión para el ranking.

---

# Al actualizar la app más adelante

1. Sube el `index.html` nuevo.
2. **Abre `sw.js` y cambia `efpa-efa-v1` por `efpa-efa-v2`.**

   Esto importa: si no cambias ese número, a quien ya la tenga instalada le seguirá saliendo la versión antigua guardada en su móvil.

---

# Sobre la seguridad

La clave *anon* de Supabase es pública por diseño: viaja dentro de cualquier web que lo use. Con las reglas de arriba, quien tenga el enlace puede leer y escribir en la tabla del ranking.

Para un grupo de compañeros de curso es suficiente. **No metáis ahí nada confidencial**: solo nombres de pila y números de progreso.

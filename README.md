# 📒 Álbum de Estampas

> Tracker de colección de estampas inspirado en el Mundial, Pokémon y NBA.
> Registra cada estampa con sección, estado (faltante / repetida / pegada) y progreso de completado por sección.

---

## 🖼️ Mis primeras Estampas

| # | Nombre | Estado | Rareza | Sección |
|---|--------|--------|--------|---------|
| 10 | Messi | Pegada ✅ | Legendaria | Argentina |
| 11 | Neymar Jr. | Repetida 🔁 | Épica | Brasil |
| — | Mbappé | Faltante ❌ | Legendaria | Grupo A |
| — | Pikachu holo | Pegada ✅ | Rara | Pokémon |
| — | Michael Jordan rookie | Faltante ❌ | Legendaria | NBA |

---

## 🚀 Instalación y ejecución

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend (Express + SQLite)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
# → http://localhost:3001
```

> **Nota:** En Fase 1, el frontend usa LocalStorage de forma independiente. La conexión frontend ↔ backend se realiza en Fase 2.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite |
| Estado | useState + useReducer + Context API |
| Persistencia local | LocalStorage |
| Gráficas | Recharts |
| Peticiones HTTP | fetch nativo |
| Backend | Node.js + Express |
| Base de datos | SQLite (better-sqlite3) |
| Estilos | CSS puro + variables CSS |

---

## 📁 Estructura del Proyecto

```
album-estampas/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FormularioItem.jsx    ← CRUD
│   │   │   ├── ListaItems.jsx        ← filtros
│   │   │   ├── ItemCard.jsx          ← tarjeta
│   │   │   ├── ModalEditar.jsx
│   │   │   └── Estadisticas.jsx
│   │   ├── context/
│   │   │   ├── StorageContext.jsx    ← contexto central
│   │   │   └── itemsReducer.js      ← 8 acciones
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useFetch.js
│   │   │   ├── useAtajoTeclado.js
│   │   │   └── useProgresoAlbum.js  ← hook del dominio
│   │   ├── charts/
│   │   │   ├── GraficaActividad.jsx       ← actividad/día
│   │   │   ├── GraficaCategoria.jsx       ← distribución
│   │   │   └── GraficaFaltantesRepetidas.jsx ← ORIGINAL
│   │   └── utils/
│   │       ├── categorias.js
│   │       └── itemFactory.js
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── index.js
    │   ├── routes/items.js
    │   └── db/database.js
    └── package.json
```

---

## 🗄️ Modelo de Datos

### Item (Estampa)

```json
{
  "id": "uuid",
  "nombre": "Messi 10",
  "categoriaId": "argentina",
  "estado": "pegada",
  "puntuacion": 10,
  "fechaRegistro": "2025-05-13T...",
  "fechaActividad": "2025-05-17T...",
  "notas": "Edición especial dorada",
  "atributos": {
    "numero": "10",
    "seccion": "Estrellas del Torneo",
    "repetida": false,
    "pegada": true,
    "rareza": "legendaria"
  },
  "activo": true
}
```

### Registro (Actividad diaria)

```json
{
  "id": "uuid",
  "itemId": "uuid-del-item",
  "fecha": "2025-05-17",
  "valor": 3,
  "notas": "Conseguí 3 sobres hoy"
}
```

---

## 🎨 Paleta de Colores

| Variable | Color | Uso |
|----------|-------|-----|
| `--bg-primary` | `#181925` | Fondo principal |
| `--cyan` | `#C0F5FA` | Acento principal |
| `--success` | `#4ade80` | Estampas pegadas |
| `--warning` | `#facc15` | Estampas repetidas |
| `--danger` | `#f87171` | Estampas faltantes |
| `--purple` | `#a78bfa` | Actividad / registros |

---

## 🔌 API Endpoints

```
GET    /api/items              → Lista activos
GET    /api/items/:id          → Un item
POST   /api/items              → Crear
PUT    /api/items/:id          → Actualizar
DELETE /api/items/:id          → Archivar (activo=0)
POST   /api/items/:id/registro → Registrar actividad
GET    /api/items/:id/registros → Registros del item
```

---

## 🧰 Decisiones Técnicas

1. **LocalStorage con lazy initializer**: Se usa `useState(() => { ... })` para leer el storage solo al montar, evitando lecturas en cada render.

2. **useReducer centralizado**: Todas las mutaciones de items pasan por el reducer con 8 acciones puras (HIDRATAR, AGREGAR, EDITAR, ELIMINAR, CAMBIAR_ESTADO, TOGGLE, ARCHIVAR, RESTAURAR), facilitando el debugging y la trazabilidad.

3. **Arquitectura de contexto opaca**: Los componentes nunca saben si hablan con API o LocalStorage. Toda esa lógica vive en `StorageContext`. En Fase 2 se conectará al backend sin cambiar ningún componente.

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+N` | Nueva estampa |
| `Ctrl+D` | Dashboard |
| `Ctrl+E` | Lista de estampas |
| `Esc` | Cerrar modal |

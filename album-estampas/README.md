# Diego Sandoval 231977
# Tema elegido: Álbum de Estampas
 
> Tracker personal de colección de estampas — Mundial, Pokémon y NBA.  
> Registra cada estampa con sección, estado y rareza. Lleva el control de lo que tienes, lo que falta y lo que puedes intercambiar.
 
---

## para correr el front 

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## para correr el back

```bash
cd backend
cp .env.example .env
# Editar .env con tu la clave del pgadmin
npm install
npm run dev
# → http://localhost:3001

```
### Nuevas funcionalidades

- **Switch de modo (API / Local):** Botón en la Navbar que cambia entre `localStorage` y la API. Al cambiar de modo se cargan los datos de cada uno.
- **Tema claro/oscuro:** Botón ☀️/🌙 en la Navbar este tema se mantiene al refrescar y cuenta con el atajo de teclado `T` 
- **Atajos de teclado:**
  - `Ctrl+N`  nos manda a agregar una nueva estampa y directos al nombre
  - `T`  cambia entre los temas de calro y oscuro 

---

## Mi paleta de colores
 
### Tema Oscuro
 
| Variable | Valor | Decisión |
|----------|-------|----------|
| `--color-bg` | `#181925` | Fondo base azul para evitar el aburrido negro. |
| `--color-bg-surface` | `#232638` | Superficie de tarjetas de un tono mas claro para dar contraste |
| `--color-accent` | `#C0F5FA` | Celeste claro para dar un tipo de importancia a este color|
| `--color-success` | `#4ade80` | Verde para validar las pegadas. |
| `--color-danger` | `#f87171` | Rojo para alertas o borrar y para referir que aun no se tiene una estampa. |
| `--color-text-muted` | `#8b90b0` | Texto secundario con un buen contraste pero dejando en claro que es secundario. |
 
### Tema Claro
 
| Variable | Valor | Decisión |
|----------|-------|----------|
| `--color-bg` | `#f4f6fb` | celeste muy claro para no usar el tipico blanco. |
| `--color-bg-surface` | `#ffffff` |Blanco para dar el contraste de las tarjetas . |
| `--color-accent` | `#1a73c8` | Azul fuerte mismo que el celeste de tema oscuro |
| `--color-success` | `#16a34a` | Verde para validar las pegadas.. |
| `--color-danger` | `#dc2626` | ojo para alertas o borrar y para referir que aun no se tiene una estampa. |
| `--color-text-muted` | `#4a4f6a` |Texto secundario con un buen contraste pero dejando en claro que es secundario.. |
 
---

### imagen de los dos temas de colores y de los dos modos (api y local )
![alt text](image.png)
![alt text](image-1.png)

![alt text](image-2.png)
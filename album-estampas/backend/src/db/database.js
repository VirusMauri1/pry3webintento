import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const db = postgres(process.env.DATABASE_URL);

export async function initTables() {

  try {
    await db`
      CREATE TABLE IF NOT EXISTS items (
        id UUID PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        "categoriaId" VARCHAR(100) NOT NULL,
        estado VARCHAR(30) NOT NULL DEFAULT 'faltante',
        puntuacion NUMERIC
        CHECK (puntuacion BETWEEN 0 AND 10),
        "fechaRegistro" TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "fechaActividad" TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        notas TEXT,
        atributos JSONB,
        activo BOOLEAN NOT NULL DEFAULT TRUE
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS registros (
        id UUID PRIMARY KEY,
        "itemId" UUID NOT NULL
        REFERENCES items(id)
        ON DELETE CASCADE,
        fecha TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
        valor INTEGER NOT NULL DEFAULT 1,
        notas TEXT
      )
    `;
    console.log(" Tablas verificadas");
  } catch (error) {
    console.error(" Error creando tablas:", error);
  }
}
export default db;
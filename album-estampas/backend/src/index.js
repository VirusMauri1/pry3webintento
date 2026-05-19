import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js";
import db, { initTables } from "./db/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());
app.use("/api/items", itemsRouter);
async function startServer() {
  try {

    await db`SELECT 1`;
    console.log("Conexión exitosa a PostgreSQL");

    await initTables();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando servidor:", error);
  }
}

startServer();
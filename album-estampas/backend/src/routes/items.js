import express from "express";
import crypto from "crypto";
import db from "../db/database.js";

const router = express.Router();

const parseItem = (item) => {
  if (!item) return null;

  return {
    ...item,
    atributos:
      typeof item.atributos === "string"
        ? JSON.parse(item.atributos)
        : item.atributos || {},
    puntuacion:
      item.puntuacion !== null
        ? Number(item.puntuacion)
        : null,
    activo: Boolean(item.activo)
  };
};

// GET /api/items
router.get("/", async (req, res) => {
  try {
    const items = await db`
      SELECT *
      FROM items
      WHERE activo = true
      ORDER BY "fechaRegistro" DESC
    `;
    res.json(items.map(parseItem));
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los items"
    });
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res) => {
  try {

    const result = await db`
      SELECT *
      FROM items
      WHERE id = ${req.params.id}
    `;

    if (result.length === 0) {
      return res.status(404).json({
        error: "Item no encontrado"
      });
    }

    res.json(parseItem(result[0]));
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener el item"
    });
  }
});

// POST /api/items
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      categoriaId,
      estado,
      puntuacion,
      notas,
      atributos
    } = req.body;
    if (!nombre || !categoriaId || !estado) {
      return res.status(400).json({
        error: "Faltan campos obligatorios"
      });
    }
    const result = await db`
      INSERT INTO items (
        id,
        nombre,
        "categoriaId",
        estado,
        puntuacion,
        notas,
        atributos
      )
      VALUES (
        ${crypto.randomUUID()},
        ${nombre},
        ${categoriaId},
        ${estado},
        ${puntuacion ?? null},
        ${notas ?? null},
        ${atributos ?? {}}
      )
      RETURNING *
    `;
    res.status(201).json({
      item: parseItem(result[0])
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear el item"
    });
  }
});
// PUT /api/items/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      categoriaId,
      estado,
      puntuacion,
      notas,
      atributos,
      activo
    } = req.body;

    const result = await db`
      UPDATE items
      SET
        nombre = COALESCE(${nombre ?? null}, nombre),
        "categoriaId" = COALESCE(
          ${categoriaId ?? null},
          "categoriaId"
        ),
        estado = COALESCE(
          ${estado ?? null},
          estado
        ),
        puntuacion = COALESCE(
          ${puntuacion ?? null},
          puntuacion
        ),
        notas = COALESCE(
          ${notas ?? null},
          notas
        ),
        atributos = COALESCE(
          ${atributos ?? null},
          atributos
        ),
        activo = COALESCE(
          ${activo ?? null},
          activo
        ),
        "fechaActividad" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({
        error: "Item no encontrado"
      });
    }
    res.status(200).json({
      item: parseItem(result[0])
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar el item"
    });
  }
});
// DELETE /api/items/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db`
      UPDATE items
      SET
        activo = false,
        "fechaActividad" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({
        error: "Item no encontrado"
      });
    }
    res.status(200).json({
      mensaje: "Item archivado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al eliminar el item"
    });
  }
});
// POST /api/items/:id/registro
router.post("/:id/registro", async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, notas } = req.body;
    if (valor === undefined) {
      return res.status(400).json({
        error: "El valor es obligatorio"
      });
    }
    const result = await db`
      INSERT INTO registros (
        id,
        "itemId",
        valor,
        notas
      )
      VALUES (
        ${crypto.randomUUID()},
        ${id},
        ${valor},
        ${notas ?? null}
      )
      RETURNING *
    `;
    await db`
      UPDATE items
      SET "fechaActividad" = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    res.status(201).json({
      registro: result[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear el registro"
    });
  }
});

// GET /api/items/:id/registros
router.get("/:id/registros", async (req, res) => {
  try {
    const registros = await db`
      SELECT *
      FROM registros
      WHERE "itemId" = ${req.params.id}
      ORDER BY fecha DESC
    `;

    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener registros"
    });
  }
});
export default router;
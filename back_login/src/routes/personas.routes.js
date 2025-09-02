const express = require('express');
const router = express.Router();
const CrudController = require('../controllers/crud.controller');

const crud = new CrudController();

const tabla = 'personas';
const idCampo = 'id_persona';

router.get('/', async (req, res) => {
    try {
        const personas = await crud.obtenerTodos(tabla);
        res.json(personas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const persona = await crud.obtenerUno(tabla, idCampo, req.params.id);
        res.json(persona);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaPersona = await crud.crear(tabla, req.body);
        res.status(201).json(nuevaPersona);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const personaActualizada = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(personaActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await crud.eliminar(tabla, idCampo, req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
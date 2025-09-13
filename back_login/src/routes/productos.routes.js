const express = require('express');
const router = express.Router();
const CrudController = require('../controllers/crud.controller');

//Instanciamos el controlador
const crud = new CrudController();

//Tabla y campo que usaremos para este CRUD
const tabla = 'productos';
const idCampo = 'id_producto';

//Obtener todas las personas
router.get('/', async (req, res) => {
    try {
        const productos = await crud.obtenerTodos(tabla);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Obtener personas por su ID
router.get('/', async (req, res) => {
    try {
        const productos = await crud.obtenerUno(tabla, idCampo, req.params.id);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Crear una nueva persona
router.post('/', async (req, res) => {
    try {
        const nuevaProducto = await crud.crear(tabla, req.body);
        res.status(201).json(nuevaProducto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Actualizar una persona
router.put('/:id', async (req, res) => {
    try {
        const productoActualizada = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(productoActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Eliminar una persona
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await crud.eliminar(tabla, idCampo, req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
const { Router } = require('express'); 
const { ConnectionDatabase } = require('../../../config/connectDatabase'); 
const { QueryTypes } = require('sequelize'); 

const router = Router(); 

// Endpoint para obtener todos los clientes
router.get('/', async (req, res) => { 
    try {
        const query = 'SELECT * FROM "public"."ck_cliente"'; 
        const clientes = await ConnectionDatabase.query(query, {
            type: QueryTypes.SELECT
        });
        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los datos.' });
    }
});

module.exports = router;
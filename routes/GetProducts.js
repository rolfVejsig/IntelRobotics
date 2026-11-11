
const express = require('express');
const router = express.Router();

const exampleController = require('../controllers/exampleController');

// GET requests
router.get('/Get_all_products', async (req, res) => {
    
    try {
        const product_info = await pool.query(
            "CALL Get_all_products()"
        );
    } catch (error) {
        console.error("Products colection error:", error)

        res.status(500).json({
            error: "Database error"
        })
    }
});


module.exports = router;

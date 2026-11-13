
const express = require('express');
const router = express.Router();

const { pool } = require('../config/database');

router.get('/category/:id', async (req, res) => {

    try {

        const categoryId = Number(req.params.id);

        // Validate ID
        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return res.status(400).json({
                error: 'Invalid category ID'
            });
        }

        // Execute stored procedure with category ID
        const [results] = await pool.query(
            'CALL Get_products_by_category(?)',
            [categoryId]
        );

        const rows = results[0];

        // Check if products exist
        if (!rows || rows.length === 0) {
            return res.status(404).json({
                error: 'No products found'
            });
        }

        // Create category object
        const category = {
            category_id: rows[0].Category_id,
            category_name: rows[0].Category_name,
            category_description: rows[0].Category_description,
            image_path: rows[0].Image_path,
            products: []
        };

        const productMap = new Map();

        // Organize products and advantages
        for (const row of rows) {

            if (!productMap.has(row.Product_id)) {

                const product = {
                    product_id: row.Product_id,
                    product_name: row.Product_name,
                    product_price: row.Product_price,
                    product_description: row.Product_description,
                    advantages: []
                };

                productMap.set(row.Product_id, product);
                category.products.push(product);
            }

            const product = productMap.get(row.Product_id);

            // Add advantages
            if (row.Advantage_id !== null) {

                product.advantages.push({
                    advantage_id: row.Advantage_id,
                    advantage_content: row.Advantage_content,
                    active: row.Active
                });
            }
        }

        res.status(200).json(category);

    } catch (error) {

        console.error('Product collection error:', error);

        res.status(500).json({
            error: 'Database error'
        });
    }
});

module.exports = router;
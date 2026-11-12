
const express = require('express');
const router = express.Router();

const { pool } = require('../config/database');

router.get('/Get_all_products', async (req, res) => {

    try {
        // Execute stored procedure
        const [results] = await pool.query(
            'CALL Get_all_products()'
        );

        // First result set contains the SELECT results
        const rows = results[0];

        const categoryMap = new Map();
        const productMap = new Map();

        // Organize SQL rows into categories and products
        for (const row of rows) {

            // Create category if it does not exist
            if (!categoryMap.has(row.category_id)) {

                categoryMap.set(row.category_id, {
                    category_id: row.category_id,
                    category_name: row.category_name,
                    category_description: row.category_description,
                    image_path: row.image_path,
                    products: []
                });
            }

            // Skip product creation for empty categories
            if (row.product_id === null) {
                continue;
            }

            const category = categoryMap.get(row.category_id);

            // Create product if it does not exist
            if (!productMap.has(row.product_id)) {

                const product = {
                    product_id: row.product_id,
                    product_name: row.product_name,
                    product_price: row.product_price,
                    product_description: row.product_description,
                    advantages: []
                };

                productMap.set(row.product_id, product);
                category.products.push(product);
            }

            const product = productMap.get(row.product_id);

            // Add advantage if one exists
            if (row.advantage_id !== null) {

                product.advantages.push({
                    advantage_id: row.advantage_id,
                    advantage_content: row.advantage_content,
                    included: row.included
                });
            }
        }

        // Convert Map into a normal array for JSON
        const categories = Array.from(categoryMap.values());

        res.status(200).json({
            categories: categories
        });

    } catch (error) {

        console.error('Products collection error:', error);

        res.status(500).json({
            error: 'Database error'
        });
    }
});

module.exports = router;

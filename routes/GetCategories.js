
const express = require('express');
const router = express.Router();

const { pool } = require('../config/database');

router.get('/Get_categories', async (req, res) => {
    try {
        const [results] = await pool.query('CALL Get_all_products()');
        const rows = results[0];

        const categories = new Map();

        for (const row of rows) {
            if (!categories.has(row.category_id)) {
                categories.set(row.category_id, {
                    category_id: row.category_id,
                    category_name: row.category_name,
                    category_description: row.category_description,
                    image_path: row.image_path,
                    page_path: row.page_path, // New field
                    products: []
                });
            }

            const category = categories.get(row.category_id);
            let product = category.products.find(
                item => item.product_id === row.product_id
            );

            if (!product) {
                product = {
                    product_id: row.product_id,
                    product_name: row.product_name,
                    product_price: row.product_price,
                    product_description: row.product_description,
                    advantages: []
                };

                category.products.push(product);
            }

            if (row.advantage_id !== null) {
                product.advantages.push({
                    advantage_id: row.advantage_id,
                    advantage_content: row.advantage_content,
                    included: row.included
                });
            }
        }

        res.status(200).json({
            categories: Array.from(categories.values())
        });

    } catch (error) {
        console.error('Products collection error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

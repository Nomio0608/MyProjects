const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '12345678',
    database: 'postgres',
    port: 5432
});

const db = {
    async insertIngredient(ingredient, userId) {
        try {
            const query = 'INSERT INTO ingredients (name, user_id) VALUES ($1, $2)';
            await pool.query(query, [ingredient, userId]);
        } catch (error) {
            console.error('Error inserting ingredient:', error);
        }
    }
};

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        client.release();
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

testConnection();

module.exports = db; 
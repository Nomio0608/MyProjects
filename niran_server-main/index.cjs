const express = require("express");
const pg = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require('cors');
 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

app.use(cors()); 

app.use(bodyParser.json());

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
});

app.post("/order", async (req, res) => {
    try {
        const { user_id, artist_id, orders_hour, orders_day, order_date } = req.body;

        // 1. Шалгах: Тухайн өдөр, цагт захиалга байгаа эсэх
        const checkQuery = `
            SELECT 1 FROM public."orders" 
            WHERE artist_id = $1 AND order_date = $2 AND orders_hour = $3
        `;
        const { rowCount } = await pool.query(checkQuery, [artist_id, order_date, orders_hour]);

        if (rowCount > 0) {
            return res.status(400).json({ message: "Аль хэдийн захиалгатай. Өөр цаг сонгоно уу" });
        }

        // 2. Захиалга үүсгэх
        const insertQuery = `
            INSERT INTO public."orders" (user_id, artist_id, orders_hour, orders_day, order_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [user_id, artist_id, orders_hour, orders_day, order_date]);

        res.status(201).json({
            message: "Order created successfully",
            order: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: "User not found"});
        }

        console.log(user.id)
        
        if(password != user.password){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

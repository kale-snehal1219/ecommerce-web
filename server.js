const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= PRODUCTS (JSON) =================
const productsPath = path.join(__dirname, 'data', 'products.json');
let products = [];

try {
    const data = fs.readFileSync(productsPath, 'utf8');
    products = JSON.parse(data);
} catch (err) {
    console.error("Error reading products:", err);
}

// ================= DATABASE (ORDERS) =================
const db = new sqlite3.Database('./orders.db', (err) => {
    if (err) console.error(err.message);
    else console.log("Orders DB Connected ✅");
});

db.run(`
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    method TEXT,
    total INTEGER
)
`);

// ================= APIs =================

// Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
});

// Categories
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
});

// Place Order
app.post('/api/place-order', (req, res) => {
    const { name, address, method, total } = req.body;

    db.run(
        "INSERT INTO orders (name, address, method, total) VALUES (?, ?, ?, ?)",
        [name, address, method, total],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: "Order placed ✅",
                orderId: this.lastID
            });
        }
    );
});

// Get Orders
app.get('/api/orders', (req, res) => {
    db.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ================= FRONTEND =================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ================= START =================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} 🚀`);
});
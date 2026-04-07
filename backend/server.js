const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Load sample product data
const productsPath = path.join(__dirname, 'data', 'products.json');
let products = [];
try {
    const data = fs.readFileSync(productsPath, 'utf8');
    products = JSON.parse(data);
} catch (err) {
    console.error("Error reading products data:", err);
}

// API endpoint to get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// API endpoint to get a specific product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// API endpoint to get categories
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
});

// Fallback to index.html for specific frontend routes (if using a SPA approach later)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`AgroChem Store server running smoothly on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}`);
});



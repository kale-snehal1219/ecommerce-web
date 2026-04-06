// LOAD PRODUCTS
fetch("/api/products")
    .then(res => res.json())
    .then(data => displayProducts(data));

function displayProducts(products) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
            <img src="${p.image}" class="product-img">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <h2>₹${p.price}</h2>
                <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add to Cart</button>
            </div>
        `;

        grid.appendChild(div);
    });
}

// CART
let cart = [];

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    alert("Added to cart ✅");
}

// PLACE ORDER
function processOrder() {
    let name = document.getElementById("bName").value;
    let addr = document.getElementById("bAddr").value;
    let method = document.getElementById("bMethod").value;

    let total = cart.reduce((sum, item) => sum + item.price, 0);

    fetch("/api/place-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            address: addr,
            method,
            total
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Order Placed ✅");
        cart = [];
    });
}

// LOAD ORDERS
function openOrdersModal() {
    fetch("/api/orders")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("ordersContainer");
            container.innerHTML = "";

            data.forEach(o => {
                container.innerHTML += `
                    <div class="order-card">
                        <h3>Order #${o.id}</h3>
                        <p>${o.name}</p>
                        <p>${o.address}</p>
                        <p>${o.method}</p>
                        <p>₹${o.total}</p>
                    </div>
                `;
            });
        });

    document.getElementById("ordersModal").style.display = "flex";
}
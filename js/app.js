// Mock Data Fallback (Prices converted to INR roughly x82)
const mockProducts = [
    {
        "id": 101, "name": "Jivamrut", "category": "Liquid Fertilizer", "price": 450,
        "image": "assets/images/jivamrut.png",
        "description": "The backbone of natural farming. A rich liquid blend of cow dung, urine, jaggery, and flour.",
        "rating": 4.9, "reviews": 845
    },
    {
        "id": 102, "name": "Gandul Khat (Vermicompost)", "category": "Premium Compost", "price": 250,
        "image": "assets/images/gandul_khat.png",
        "description": "Premium quality earthworm compost widely used for sugarcane, grapes, and pomegranates.",
        "rating": 4.8, "reviews": 612
    },
    {
        "id": 103, "name": "Shenkhat (Farmyard Manure)", "category": "Base Manure", "price": 300,
        "image": "assets/images/shenkhat.jpg",
        "description": "Well-decomposed cow and buffalo dung, the traditional and most trusted soil base.",
        "rating": 4.7, "reviews": 920
    },
    {
        "id": 104, "name": "Nimboli Pend (Neem Cake)", "category": "Pest Control", "price": 350,
        "image": "assets/images/nimboli_pend.jpg",
        "description": "Highly trusted to deter soil-borne pests like white grubs and provide slow-release nutrients.",
        "rating": 4.9, "reviews": 430
    },
    {
        "id": 105, "name": "Shengdana Pend (Groundnut Cake)", "category": "Nitrogen Source", "price": 400,
        "image": "assets/images/shengdana_pend.jpg",
        "description": "Extensively used in Maharashtra as a rich, natural source of Nitrogen.",
        "rating": 4.8, "reviews": 210
    },
    {
        "id": 106, "name": "Karanja Pend (Karanja Cake)", "category": "Pesticide & Fertilizer", "price": 600,
        "image": "assets/images/karanja_pend.jpg",
        "description": "Excellent organic pesticide and fertilizer, great for orchards and vegetable patches.",
        "rating": 4.5, "reviews": 115
    },
    {
        "id": 107, "name": "Erandi Pend (Castor Cake)", "category": "Slow Release", "price": 280,
        "image": "assets/images/erandi_pend.jpg",
        "description": "Widely used for cash crops like cotton and soybean for slow nutrient release.",
        "rating": 4.7, "reviews": 180
    },
    {
        "id": 108, "name": "Phosphate Rich Manure (PROM)", "category": "Phosphorus Rich", "price": 150,
        "image": "assets/images/prom.jpg",
        "description": "The organic alternative to DAP. Perfect for root development in initial stages.",
        "rating": 4.8, "reviews": 512
    }
];

let cart = [];
let myOrders = [];
let currentLang = localStorage.getItem('lang') || 'en';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('langSelect').value = currentLang;
    changeLanguage(currentLang);
    initScrollAnimations();
});

// Translation Logic
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Update simple translations
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations && translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Re-render complex views
    renderProducts(mockProducts);
    if (document.getElementById('cartModal').style.display === 'block') openCart();
    if (document.getElementById('ordersModal').style.display === 'block') openOrdersModal();
}

// Render Products
function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    const t = translations[currentLang];

    products.forEach((p, index) => {
        const delay = (index % 4) * 0.1;

        // I18n strings for products
        const pName = t[`p_${p.id}_name`] || p.name;
        const pCat = t[`p_${p.id}_cat`] || p.category;
        const pDesc = t[`p_${p.id}_desc`] || p.description;
        const btnAdd = t['btn_add'] || 'Add';
        const btnBuy = t['btn_buynow'] || 'Buy Now';
        const reviewsText = t['reviews_text'] || 'reviews';

        grid.innerHTML += `
            <div class="product-card fade-in-up" style="transition-delay: ${delay}s">
                <div class="product-category">${pCat}</div>
                <div class="product-img-wrapper">
                    <img src="${p.image}" class="product-img" alt="${pName}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${pName}</h3>
                    <p class="product-desc">${pDesc}</p>
                    <div style="color: var(--accent); margin-bottom: 15px; font-size: 0.9rem;">
                        <i class="fa-solid fa-star"></i> ${p.rating} (${p.reviews} ${reviewsText})
                    </div>
                    <div class="product-price-row">
                        <div class="product-price">₹${p.price}</div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-cart" onclick="addToCart(${p.id})"><i class="fa-solid fa-cart-shopping"></i> ${btnAdd}</button>
                        <button class="btn-buy" onclick="addToCart(${p.id}); openCart();">${btnBuy}</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Cart Logic
function addToCart(id) {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateCartBadge();

        const badge = document.querySelector('.cart-badge');
        badge.style.transform = "scale(1.5)";
        setTimeout(() => badge.style.transform = "scale(1)", 200);
    }
}

function updateCartBadge() {
    document.querySelector('.cart-badge').textContent = cart.length;
}

function openCart() {
    const modal = document.getElementById('cartModal');
    const itemsDiv = document.getElementById('cartItems');
    let total = 0;
    const t = translations[currentLang];

    itemsDiv.innerHTML = '';
    if (cart.length === 0) {
        itemsDiv.innerHTML = `<p class="text-center" style="color: var(--text-light)">${t['cart_empty']}</p>`;
    } else {
        cart.forEach((item, i) => {
            total += item.price;
            const pName = t[`p_${item.id}_name`] || item.name;
            itemsDiv.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}">
                    <div class="cart-item-info">
                        <strong>${pName}</strong><br>
                        <span style="color: var(--primary)">₹${item.price.toFixed(0)}</span>
                    </div>
                    <button onclick="removeFromCart(${i})" style="border:none; background:transparent; color:#d32f2f; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
    }

    document.getElementById('cartTotal').textContent = `₹${total.toFixed(0)}`;
    modal.style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    openCart(); 
}

function showCheckout() {
    document.getElementById('proceedBtn').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
}

function processOrder() {
    const name = document.getElementById('bName').value;
    const addr = document.getElementById('bAddr').value;
    if (!name || !addr) {
        alert(currentLang === 'mr' ? "कृपया नाव आणि पत्ता प्रविष्ट करा" : "Please enter Name and Address");
        return;
    }

    closeCart();

    const orderTotal = cart.reduce((sum, item) => sum + item.price, 0);

    const newOrder = {
        id: "ORD" + Math.floor(Math.random() * 100000),
        items: [...cart],
        total: orderTotal,
        date: new Date().toLocaleDateString(),
        status: "Placed"
    };
    myOrders.push(newOrder);

    const orderModal = document.getElementById('orderSuccessModal');
    let msg = `Thank you <strong>${name}</strong>!<br>Your order <strong>#${newOrder.id}</strong> for <strong>₹${orderTotal}</strong> has been placed.<br>Check the "My Orders" tab to track it!`;
    if (currentLang === 'mr') {
        msg = `धन्यवाद <strong>${name}</strong>!<br>तुमची ऑर्डर <strong>#${newOrder.id}</strong> एकूण <strong>₹${orderTotal}</strong> साठी दिली गेली आहे.<br>याचा मागोवा घेण्यासाठी 'माझ्या ऑर्डर्स' टॅब तपासा!`;
    }
    document.getElementById('orderMsg').innerHTML = msg;

    orderModal.style.display = 'flex';

    cart = [];
    updateCartBadge();
}

function closeOrderSuccess() {
    document.getElementById('orderSuccessModal').style.display = 'none';
}

// Order Tracking Logic
function openOrdersModal() {
    const modal = document.getElementById('ordersModal');
    const container = document.getElementById('ordersContainer');
    const t = translations[currentLang];
    container.innerHTML = '';

    if (myOrders.length === 0) {
        container.innerHTML = `<p class="text-center" style="color: var(--text-light)">${t['order_empty']}</p>`;
    } else {
        myOrders.forEach(order => {
            const itemsHtml = order.items.map(i => t[`p_${i.id}_name`] || i.name).join(", ");
            const placedStr = currentLang === 'mr' ? "ऑर्डर दिली" : "Placed";
            const shippedStr = currentLang === 'mr' ? "पाठवली" : "Shipped";
            const deliveredStr = currentLang === 'mr' ? "वितरित" : "Delivered";
            
            container.innerHTML += `
                <div class="order-card">
                    <div class="d-flex justify-between" style="margin-bottom: 10px;">
                        <strong>Order #${order.id}</strong>
                        <span style="color: var(--primary)">₹${order.total}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 15px;">${itemsHtml}</p>
                    
                    <div class="tracking-wrap">
                        <div class="track-step active">
                            <i class="fa-solid fa-box"></i>
                            <p>${placedStr}</p>
                        </div>
                        <div class="track-line active-line"></div>
                        <div class="track-step">
                            <i class="fa-solid fa-truck-fast"></i>
                            <p>${shippedStr}</p>
                        </div>
                        <div class="track-line"></div>
                        <div class="track-step">
                            <i class="fa-solid fa-house"></i>
                            <p>${deliveredStr}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    modal.style.display = 'block';
}

function closeOrdersModal() {
    document.getElementById('ordersModal').style.display = 'none';
}

// AI Chatbot Logic
let chatOpen = false;

function toggleChat() {
    const chat = document.getElementById('aiChatbot');
    chatOpen = !chatOpen;
    chat.style.display = chatOpen ? 'flex' : 'none';
    if (chatOpen) {
        document.getElementById('chatInput').focus();
    }
}

function openAIChat(e) {
    e.preventDefault();
    if (!chatOpen) toggleChat();
}

function handleChatKeypress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user');
    input.value = '';

    appendMessage('<span class="typing-indicator"><i></i><i></i><i></i></span>', 'bot');

    setTimeout(() => {
        const messages = document.querySelectorAll('.message.bot');
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.innerHTML.includes('typing-indicator')) {
            lastMsg.remove();
        }

        const reply = generateBotReply(msg.toLowerCase());
        appendMessage(reply, 'bot');
    }, 1200);
}

function appendMessage(text, sender) {
    const body = document.getElementById('chatBody');
    body.innerHTML += `<div class="message ${sender}">${text}</div>`;
    body.scrollTop = body.scrollHeight;
}

function generateBotReply(msg) {
    if (currentLang === 'mr') {
        if (msg.includes('ऊस')) return "ऊसासाठी, प्रीमियम गांडूळ खत अत्यंत उत्कृष्ट आहे. यामुळे ऊसाची जाडी आणि उत्पादन वाढते!";
        if (msg.includes('कापूस')) return "कापसासाठी शुद्ध निंबोळी पेंड वापरा, जे मातीतील कीटक दूर ठेवताना आवश्यक पोषक तत्त्वे पुरवते.";
        if (msg.includes('कांदा') || msg.includes('लसूण')) return "कांद्यासाठी हाडांचे खत पावडर उत्तम ठरते, कारण ते मजबूत कंदाच्या वाढीसाठी आवश्यक फॉस्फरस प्रदान करते.";
        if (msg.includes('ज्वारी') || msg.includes('बाजरी')) return "ज्वारी आणि बाजरीसाठी आमचे जुने शेणखत एक भक्कम आणि नैसर्गिक पाया प्रदान करेल.";
        if (msg.includes('कीटक') || msg.includes('रोग')) return "रक्षण करण्यासाठी आमची शुद्ध निंबोळी पेंड वापरा.";
        return "हा एक उत्तम प्रश्न आहे! सेंद्रिय शेती दीर्घकालीन उत्पादन सुनिश्चित करते. मी तुम्हाला (ऊस, कापूस, कांदा) कोणत्या पिकासाठी मदत करू शकतो?";
    } else {
        if (msg.includes('sugarcane') || msg.includes('cane')) return "For Sugarcane, Premium Vermicompost is fantastic to boost cane thickness and yield!";
        if (msg.includes('cotton')) return "For Cotton, I recommend Pure Neem Cake to provide nutrients while keeping soil pests away.";
        if (msg.includes('onion') || msg.includes('garlic')) return "For Onion, Bone Meal Powder is ideal as it provides essential phosphorus for strong bulb development.";
        if (msg.includes('jowar') || msg.includes('bajra')) return "For Jowar and Bajra, our Aged Cow Dung Compost provides a solid and natural base.";
        if (msg.includes('pest') || msg.includes('disease')) return "To manage soil pests naturally, apply our Pure Neem Cake.";
        return "That's a great question! Organic farming ensures long-term yield. I recommend Vermicompost as a highly nutrient-rich start for almost everything. Can I specify for a particular crop (like Sugarcane or Cotton)?";
    }
}

// Scroll Animations Logic
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

window.onclick = function (event) {
    if (event.target == document.getElementById('cartModal')) closeCart();
    if (event.target == document.getElementById('ordersModal')) closeOrdersModal();
}

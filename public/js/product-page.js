
// Format database prices for display.
// This example assumes your prices are stored in USD.
function formatPrice(price) {

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(Number(price));
}


// Create an HTML element with text content
function createElement(tag, className, content = '') {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    element.textContent = content;

    return element;
}


// Load category information
async function loadProductPage() {

    try {

        // Get category ID from HTML or URL
        const urlParams = new URLSearchParams(window.location.search);

        const categoryId =
            document.body.dataset.categoryId ||
            urlParams.get('category');

        if (!categoryId || !/^\d+$/.test(categoryId)) {
            throw new Error('Missing or invalid category ID');
        }

        // Fetch category from API
        const response = await fetch(
            `/api/products/category/${encodeURIComponent(categoryId)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const category = await response.json();

        // Populate category information
        renderCategory(category);

    } catch (error) {

        console.error('Product page loading error:', error);

        document.getElementById('product-grid').textContent =
            'Could not load products. Please try again later.';
    }
}


// Populate category information
function renderCategory(category) {

    // Update page title
    document.title = `${category.category_name} | IntelRobotics`;

    // Hero information
    document.getElementById('category-kicker').textContent =
        `IntelRobotics / ${category.category_name}`;

    document.getElementById('category-title').textContent =
        category.category_name;

    document.getElementById('category-description').textContent =
        category.category_description || '';

    // Category image
    const image = document.getElementById('category-image');

    if (category.image_path) {

        image.src = category.image_path;
        image.alt = category.category_name;
        image.hidden = false;
    }

    // Products
    const products = category.products || [];

    // Find lowest product price
    const prices = products
        .map(product => Number(product.product_price))
        .filter(price => Number.isFinite(price));

    const priceElement = document.getElementById('category-price');

    if (prices.length > 0) {

        const lowestPrice = Math.min(...prices);

        document.getElementById('category-min-price').textContent =
            formatPrice(lowestPrice);

        priceElement.hidden = false;

    } else {

        priceElement.hidden = true;
    }

    // Update models heading
    document.getElementById('models-heading').textContent =
        `Find the right ${category.category_name} for your operation.`;

    // Generate product cards
    renderProducts(products);
}


// Generate individual product cards
function renderProducts(products) {

    const container = document.getElementById('product-grid');

    // Remove loading message
    container.replaceChildren();

    if (products.length === 0) {

        container.textContent = 'No products available in this category.';

        return;
    }

    products.forEach(product => {

        // Product article
        const article = createElement('article', 'pricing-card');

        // Product name
        const heading = createElement('h3', '', product.product_name);

        // Product description
        const description = createElement(
            'p',
            '',
            product.product_description || ''
        );

        // Product price
        const price = createElement(
            'strong',
            'model-price',
            formatPrice(product.product_price)
        );

        // Contact sales button
        const button = createElement(
            'button',
            'sales-button',
            'Contact sales'
        );

        button.type = 'button';

        button.dataset.product = product.product_name;
        button.dataset.productId = product.product_id;

        // Advantages list
        const advantagesList = document.createElement('ul');

        (product.advantages || []).forEach(advantage => {

            const item = createElement(
                'li',
                '',
                advantage.advantage_content
            );

            // Inactive advantages are shown as not included
            if (Number(advantage.active) !== 1) {
                item.classList.add('not-included');
            }

            advantagesList.appendChild(item);
        });

        // Assemble product card
        article.append(
            heading,
            description,
            price,
            button,
            advantagesList
        );

        container.appendChild(article);
    });
}


// Start loading the page
loadProductPage();

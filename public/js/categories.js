
const cardColors = [
    'purple',
    'rose',
    'blue',
    'lavender'
];

async function loadProductCategories() {

    const container = document.getElementById('product-categories');

    try {

        // Fetch data from Express API
        const response = await fetch(
            '/api/categories/Get_categories'
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        const categories = data.categories;

        // Clear loading message
        container.replaceChildren();

        if (!categories || categories.length === 0) {
            container.textContent = 'No product categories found.';
            return;
        }

        // Create an article for every category
        categories.forEach((category, index) => {

            const article = document.createElement('article');
            article.className =
                `card ${cardColors[index % cardColors.length]}`;

            // Category image
            const image = document.createElement('img');

            image.src = category.image_path ||
                'images/robots/robot_arm.png';

            image.alt = category.category_name;
            image.loading = 'lazy';

            // Category content
            const content = document.createElement('div');
            content.className = 'card-content';

            const heading = document.createElement('h3');
            heading.textContent = category.category_name;

            const description = document.createElement('p');
            description.textContent = category.category_description;

            content.append(heading, description);

            // Product count
            const productCount = document.createElement('p');
            productCount.className = 'product-count';
            productCount.textContent =
                `${category.products.length} products available`;

            content.appendChild(productCount);

            // Explore button
            const button = document.createElement('button');

            button.className = 'card-action';
            button.type = 'button';
            button.textContent = 'Explore products →';

            button.addEventListener('click', () => {
                window.location.href = category.page_path;
            });

            article.append(image, content, button);

            container.appendChild(article);
        });

    } catch (error) {

        console.error('Could not load products:', error);

        container.textContent =
            'An error occurred while loading product categories.';
    }
}

// Load categories when the script executes
loadProductCategories();

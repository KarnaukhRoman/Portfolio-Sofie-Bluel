// .assets/js/galleryutils.js
export function renderGallery(gallery) {
    const blockGallery = document.querySelector('.gallery');
    if (!blockGallery) {
        console.error('Gallery container not found!');
        return;
    }
    blockGallery.innerHTML = ''; // Clean before adding
    gallery.forEach(item => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}">
            <figcaption>${item.title}</figcaption>
        `;
        blockGallery.appendChild(figure);
    });
};

export function createCategoryButtons(categories, showAllCategories, filterCategories) {
    const container = document.querySelector('.filters');
    if (!container) {
        console.error('Category buttons container not found!');
        return;
    }
    container.innerHTML = ''; // Clean before adding
    // Button “Tous” to show all categories
     container.innerHTML += `<button data-id="all" class="active">Tous</button>`;

     // Create Buttons for each category
     categories.forEach(category => {
         container.innerHTML += `<button data-id="${category.id}">${category.name}</button>`;
     });
}
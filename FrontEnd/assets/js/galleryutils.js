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

export function createCategoryButtons(categories, loadGallery) {
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

    const buttons = container.querySelectorAll('button');
    container.addEventListener('click', (event) => {
        //Identify the pressed button:
        const button = event.target;
        const categoryId = event.target.dataset.id;
        if (categoryId) {
            //Remove the active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            //Add the active class to the clicked button
            button.classList.add('active'); 
            loadGallery(categoryId); // Passing category ID
        };

    });
}



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


// Function for creating HTML for a modal window
function createLoginModal() {
    const modal = document.createElement('section');
    modal.id = 'login-modal';
    modal.className = 'hidden';
    modal.innerHTML = `
        <h2>Log In</h2>
        <form id="login-form">
            <label for="username">E-mail</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Se connecter</button>
        </form>
        <a href="#" id="forgot-password">Mot de passe oublié?</a>
    `;
    return modal;
}

function setupLoginModal() {
    const loginButton = document.querySelector('nav ul li:nth-child(3)'); // Find the element <li>login
    const sections = document.querySelectorAll('main > section'); // All sections in the <main
    const main = document.querySelector('main');

    // Create and add HTML for the modal window
    const modal = createLoginModal();
    main.appendChild(modal); // Add a modal window after the last section
    console.log(modal);

    // Open a modal window
    loginButton.addEventListener('click', () => {
        // Hide all sections except 'login-modal'
        sections.forEach(section => section.classList.add('hidden')); 
        // Show the modal window
        modal.classList.remove('hidden');
    });

    // Close the modal window if the user clicks outside the form
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeLoginModal(modal, sections);
        }
        console.log(event.target)
    });
}

// Close the modal window and return the sections
function closeLoginModal(modal, sections) {
    sections.forEach(section => section.classList.remove('hidden'));
    modal.classList.add('hidden'); 
}

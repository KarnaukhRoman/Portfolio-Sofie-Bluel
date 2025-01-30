// .assets/js/galleryutils.js
import { getData, deleteData, URL_API_DELETE, URL_API_WORKS, URL_API_CATEGORIES } from "./apirequests.js";

export async function galleryFilter(categoryId = null) {
    const allGallery = await getData(URL_API_WORKS);
    if (categoryId === "all" || categoryId === null) {
        // Show all categories
        renderGallery(allGallery);
    } else {
        // Filtering by category
        const filteredGallery = allGallery.filter(item => item.categoryId === Number(categoryId));
        renderGallery(filteredGallery);
    };
};

export function renderGallery(gallery) {
    const blockGallery = document.querySelector('.gallery');
    if (!blockGallery) {
        console.error('Gallery container not found!');
        return;
    }
    blockGallery.innerHTML = '';
    gallery.forEach(item => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}">
            <figcaption>${item.title}</figcaption>
        `;
        blockGallery.appendChild(figure);
    });
};

export function createCategoryButtons(categories) {
    const container = document.querySelector('.filters');
    if (!container) {
        console.error('Category buttons container not found!');
        return;
    }
    container.innerHTML = '';
    // Button “Tous” to show all categories
     container.innerHTML += `<button data-id="all" class="active-button">Tous</button>`;

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
            buttons.forEach(btn => btn.classList.remove('active-button'));
            //Add the active class to the clicked button
            button.classList.add('active-button'); 
            galleryFilter(categoryId); // Passing category ID
        };
    });
};


export function enableEditMode() {
    document.body.classList.add('edit-mode');
    document.querySelector('.filters').style.display = 'none';
    const editModeText = document.createElement('div');
    editModeText.classList.add('edit-mode-text');
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-pen-to-square';

    // Add an icon before the text
    editModeText.appendChild(icon);

    // Add text after the icon
    const textNode = document.createTextNode(' Mode edition');
    editModeText.appendChild(textNode);

    document.body.prepend(editModeText);
       // Add an icon and a caption next to “Mes Projets” in the portfolio section
       const portfolioHeading = document.querySelector('#portfolio h2');
       if (portfolioHeading) {
           const modifyWrapper = document.createElement('span');
           modifyWrapper.classList.add('modify-wrapper'); 
   
           const iconPortfolio = document.createElement('i');
           iconPortfolio.className = 'fa-regular fa-pen-to-square'; 
   
           const textPortfolio = document.createTextNode(' modifie');
   
           modifyWrapper.appendChild(iconPortfolio);
           modifyWrapper.appendChild(textPortfolio);
   
           portfolioHeading.appendChild(modifyWrapper);
           modifyWrapper.addEventListener('click', () => {
            // alert("You are in edit mode")
            showGalleryModal();
            });
    };
};

export function setupLogout(linkSelector) {
    const loginLink = document.querySelector(linkSelector);
    if (!loginLink) return; // If the link is not found, we do nothing
    loginLink.textContent = 'logout'; // Change the text to “Logout”
    loginLink.href = '#'; // Deactivate the standard link
    loginLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        localStorage.removeItem('token'); // Delete the token from the local storage
        sessionStorage.removeItem('loginValid'); // Resetting the login status
        // alert('Vous êtes déconnecté.'); 
        window.location.reload();
    });
};

async function createGalleryModal() {
    const gallery = await getData(URL_API_WORKS);
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
    <div class = "gallery-modal-block">
        <button class="button-close"><i class="fa-solid fa-xmark"></i></button>
        <p>Galerie photo</p>
        <div class = "gallery-modal-content">
        </div>
        <hr>
        <button id="button-add-photo">Ajouter une photo</button>
    </div>
    `;
    const galleryContent = modal.querySelector('.gallery-modal-content');
    if (gallery) {
        gallery.forEach((item) => {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = "image-wrapper";
            imageWrapper.dataset.id = item.id;
            imageWrapper.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.imageUrl}">
                <button class="delete-button" data-index="${item.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            galleryContent.appendChild(imageWrapper);
        });
    }  
    return modal;
}

async function showGalleryModal() {
    const loginButton = document.querySelector('nav ul li:nth-child(3)');
    const sections = document.querySelectorAll('main > section');
    const main = document.querySelector('footer');
    let modal = document.querySelector('#gallery-modal');
    if (!modal){
        modal = await createGalleryModal();
        main.appendChild(modal); 
    };
    modal.style.display = 'flex';

    // Close the modal window if the user clicks outside the form
    const closeButton = modal.querySelector('.button-close');
    modal.addEventListener('click', (event) => {
        const isCloseButton = closeButton.contains(event.target);
        if (event.target === modal || isCloseButton) {
            modal.style.display = 'none';  
        }
    });

    const galleryContent = modal.querySelector('.gallery-modal-content');
    const deleteButtons = galleryContent.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if(deleteData(URL_API_DELETE+button.dataset.index, token)){
                let itemRemove = galleryContent.querySelector(`[data-id="${button.dataset.index}"]`);
                if (itemRemove) {
                    itemRemove.remove();
                    galleryFilter();
                }
            }
        });
    });

    const addPhotoButton = document.querySelector('#button-add-photo');
    addPhotoButton.addEventListener('click', () => {
        modal.style.display = 'none'; 
        setupAddPhotoModal();
    });
}

function createAddPhotoModal() {
    const modal = document.createElement('div');
    modal.id = 'add-photo-modal';
    modal.style.display = 'none';
    modal.innerHTML = modal.innerHTML = `
    <div class="add-photo-modal-block">
        <button class="button-back"><i class="fa-solid fa-arrow-left"></i></button>
        <button class="button-close"><i class="fa-solid fa-xmark"></i></button>
        <p class="title-add-photo">Ajout photo</p>

        <form id="add-photo-form">
            <div class="photo-upload-block">
                <div class="photo-upload-preview">
                    <img id="photo-upload-img" src="" alt="Image" style=display: none>
                    <i class="fa-regular fa-image"></i>
                </div>
                <input type="file" id="photo-upload-input" accept="image/*" class="hidden">
                <button type="button" id="open-photo-button">+ Ajouter photo</button>
                <p class="desc-image">jpg, png : 4mo max</p>
                <div class="photo-preview">
                    <img id="photo-preview-img" src="" alt="Aperçu de l'image" class="hidden">
                </div>
            </div>
            <label for="photo-title">Titre:</label>
            <input type="text" id="photo-title" name="photo-title" required>

            <label for="photo-category">Catégorie:</label>
            <select id="photo-category" name="photo-category" required>
            </select>

            <button type="submit" id="button-new-photo">Valider</button>
        </form>
    </div>
`;
    return modal;
}

function setupAddPhotoModal() {
    const main = document.querySelector('footer');
    
    let addPhotoModal = document.querySelector('#add-photo-modal');
    if (!addPhotoModal){
        addPhotoModal = createAddPhotoModal();
        main.appendChild(addPhotoModal); 
    }
    addPhotoModal.style.display = 'flex';

    const addPhotoButton = document.querySelector('#button-new-photo');
    addPhotoButton.addEventListener('click', () => {
        addPhotoModal.style.display = 'flex';
    });

    const iconImage = document.querySelector(".photo-upload-preview i");
    function clearPhotoPreview() {
        const previewImg = document.getElementById("photo-upload-img");
        previewImg.src = "";
        previewImg.style.display = 'none'; 
        iconImage.style.display = 'block';
    };

    const backButton = addPhotoModal.querySelector('.button-back');
    backButton.addEventListener('click', () => {
        clearPhotoPreview();
        addPhotoModal.style.display = 'none';
        showGalleryModal();
    });

    const closeButton = addPhotoModal.querySelector('.button-close');
    closeButton.addEventListener('click', () => {
        clearPhotoPreview();
        addPhotoModal.style.display = 'none';
    });

   // Заполняем выпадающий список категорій

   async function loadCategories() {
        const categorySelect = addPhotoModal.querySelector('#photo-category');
        const categories = await getData(URL_API_CATEGORIES);
        categorySelect.innerHTML='';
        categorySelect.innerHTML = '<option value=""></option>';
        if (categories && categories.length > 0) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    }

    const openPhotoButton = document.getElementById("open-photo-button");
    const photoInput = document.getElementById("photo-upload-input");
    const photoPreview = document.getElementById("photo-upload-img");
    
    openPhotoButton.addEventListener("click", () => {
      photoInput.click(); // Симулює клік по <input type="file">
    });
  
    // Обробка вибору файлу
    photoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        // Створення тимчасового URL для попереднього перегляду
        photoPreview.src = URL.createObjectURL(file);
        photoPreview.style.display='block';
        iconImage.style.display='none'; 
      }
    });
 loadCategories();
}

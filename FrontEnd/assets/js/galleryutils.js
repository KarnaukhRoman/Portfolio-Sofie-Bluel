// .assets/js/galleryutils.js
import { initCategories, userMessage, allGallery } from "./main.js";
import { getData, deleteData, URL_API_WORKS, URL_API_CATEGORIES, postData } from "./apirequests.js";

export function galleryFilter(categoryId = null) {
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
        figure.dataset.id = item.id;
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
    const header = document.querySelector('header');
    header.style.paddingTop = '20px';
    document.querySelector('.filters').style.display = 'none';
    const editModeText = document.createElement('div');
    editModeText.className = 'edit-mode-text';
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
           const textPortfolio = document.createTextNode(' modifier');
           modifyWrapper.appendChild(iconPortfolio);
           modifyWrapper.appendChild(textPortfolio);
           portfolioHeading.appendChild(modifyWrapper);
           modifyWrapper.addEventListener('click', () => {
            showGalleryModal();
            });
    };
};

function disableEditMode(linkSelector) {         
    localStorage.removeItem('token'); // Delete the token from the local storage
    sessionStorage.removeItem('loginValid'); // Resetting the login status

// Delete editing elements
    const editModeText = document.querySelector('.edit-mode-text');
    const loginLink = document.querySelector(linkSelector);
    if (editModeText) editModeText.remove();

    const buttonModifier = document.querySelector('.modify-wrapper');
    if (buttonModifier) buttonModifier.remove();

    document.body.classList.remove('edit-mode');
    document.querySelector('header').style.paddingTop = '';
    document.querySelector('.filters').style.display = 'flex';

    const oldLink = document.querySelector(linkSelector);
    if (oldLink) {
        const newLink = document.createElement('a');
        newLink.href = 'login.html';
        newLink.textContent = 'login';
        newLink.className = oldLink.className; // зберігаємо стилі
        oldLink.replaceWith(newLink); // Повністю замінюємо елемент
    }
};

export function setupLogout(linkSelector) {
    const loginLink = document.querySelector(linkSelector);
    if (!loginLink) return; // If the link is not found, we do nothing
    loginLink.textContent = 'logout'; // Change the text to “Logout”
    loginLink.href = '#'; // Deactivate the standard link
    loginLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        alert('Vous êtes déconnecté.');     
        disableEditMode('nav a[href="#"]');
        initCategories();
        galleryFilter();
    });
};

function createGalleryModal() {
    // const gallery = await getData(URL_API_WORKS);
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
        <span class="delete-photo-message"></span>
        <button id="button-add-photo">Ajouter une photo</button>
    </div>
    `;
    const galleryContent = modal.querySelector('.gallery-modal-content');
    if (allGallery) {
        allGallery.forEach((item) => {
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
};

function showGalleryModal() {
    const loginButton = document.querySelector('nav ul li:nth-child(3)');
    const sections = document.querySelectorAll('main > section');
    const main = document.querySelector('footer');
    let modal = document.querySelector('#gallery-modal');
    if (!modal){
        modal = createGalleryModal();
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
    const galleryMain = document.querySelector('.gallery');
    const deleteButtons = galleryContent.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if(deleteData(URL_API_WORKS+button.dataset.index, token)){
                let itemRemove = galleryContent.querySelector(`[data-id="${button.dataset.index}"]`);
                let figureRemove = galleryMain.querySelector(`[data-id="${button.dataset.index}"]`);
                if (itemRemove) {
                    itemRemove.remove();
                    figureRemove.remove();
                    userMessage('.delete-photo-message','Photo supprimée avec succès', 'success');
                }
            }else{
                userMessage('.delete-photo-message','Erreur lors de la suppression de la photo', 'error');
            }
        });
    });
    
    const addPhotoButton = document.querySelector('#button-add-photo');
    addPhotoButton.addEventListener('click', () => {
        modal.style.display = 'none'; 
        showAddPhotoModal();
    });
};

function addNewProjectToGallery(project) {
    const gallery = document.querySelector('.gallery');
    const blockGallery = document.querySelector('.gallery');
    if (!blockGallery) {
        console.error('Gallery container not found!');
        return;
    };
    const figure = document.createElement("figure");
    figure.dataset.id = project.id;
    figure.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <figcaption>${project.title}</figcaption>
    `;
    gallery.appendChild(figure);

    const galleryModal = document.querySelector('.gallery-modal-content');
    const imageWrapper = document.createElement('div');
    imageWrapper.className = "image-wrapper";
    imageWrapper.dataset.id = project.id;
    imageWrapper.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <button class="delete-button" data-index="${project.id}">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    `;
    galleryModal.appendChild(imageWrapper);
};

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
                <div class="photo-upload-preview">
                    <img id="photo-upload-img" src="" alt="Image">
                    <i class="fa-regular fa-image"></i>
                    <input type="file" id="photo-upload-input" accept="image/*" class="hidden">
                    <button type="button" id="open-photo-button">+ Ajouter photo</button>
                    <p class="description-image">jpg, png : 4mo max</p>
                </div>            
            <label for="photo-title">Titre:</label>
            <input type="text" id="photo-title" name="photo-title" required>
            <label for="photo-category">Catégorie:</label>
            <select id="photo-category" name="photo-category" required>
            </select>
        </form>
        <span class="add-photo-message"></span>
        <hr>
        <button type="submit" id="button-new-photo" disabled>Valider</button>
    </div>
    `;
    return modal;
}

function showAddPhotoModal() {
    const main = document.querySelector('footer');
    let addPhotoModal = document.querySelector('#add-photo-modal');

    if (!addPhotoModal){
        addPhotoModal = createAddPhotoModal();
        main.appendChild(addPhotoModal); 

        const modalElements = {
            photoPreview: document.getElementById("photo-upload-img"),
            photoInput: document.getElementById("photo-upload-input"),
            iconImage: document.querySelector(".photo-upload-preview i"),
            openPhotoButton: document.getElementById("open-photo-button"),
            addPhotoButton: document.querySelector('#button-new-photo'),
            descriptionImage: document.querySelector(".description-image"),
            photoTitle: document.getElementById("photo-title"),
            photoCategory: document.getElementById("photo-category"),
            addPhotoMessage: document.querySelector('.add-photo-message'),
            backButton: document.querySelector('.button-back'),
            closeButton: addPhotoModal.querySelector('.button-close'),
        };

        function validateForm(elements) {
            const { photoTitle, photoCategory, photoInput, addPhotoButton } = elements;
        
            const isValid = photoTitle.value.trim() !== "" &&
                            photoCategory.value !== "" &&
                            photoInput.files.length > 0;
            addPhotoButton.disabled = !isValid;
        }
        // Add event handlers to call validation when fields change
        modalElements.photoTitle.addEventListener("input", () => validateForm(modalElements));
        modalElements.photoCategory.addEventListener("change", () => validateForm(modalElements));
        modalElements.photoInput.addEventListener("change", () => validateForm(modalElements));

        validateForm(modalElements);

        // Add event listener to the button to open the file input
        modalElements.openPhotoButton.addEventListener("click", () => {
            modalElements.photoInput.click(); // Simulates clicking on <input type="file”
              });
         
        modalElements.photoInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4 MB
                alert("The file is too large. The maximum size is 4 MB.");
                return;
            };
            if (modalElements.photoPreview.src) {
                URL.revokeObjectURL(modalElements.photoPreview.src);
            };   
            const imageURL = URL.createObjectURL(file);

            modalElements.photoPreview.src = imageURL;
            modalElements.photoPreview.onload = () => {
            modalElements.photoPreview.style.display = 'block';
            modalElements.iconImage.style.display = 'none';
            modalElements.openPhotoButton.style.display = 'none';
            modalElements.descriptionImage.style.display = 'none';
            };
        }
        }); // End of change event listener for file input 

          modalElements.addPhotoButton.addEventListener("click", async () => {
            const title = document.getElementById("photo-title").value.trim();
            const categoryId = document.getElementById("photo-category").value.trim();
            const fileImage = modalElements.photoInput.files[0]
            const token = localStorage.getItem("token");

            // Валідація полів
            if (!title || !categoryId || !fileImage) {
                userMessage('.add-photo-message',"Veuillez remplir tous les champs !", 'error');
                return;
            };
            
            if (!token) {
                userMessage('.add-photo-message',"Utilisateur non authentifié !", 'error');
                return;
            };

            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', categoryId);
            formData.append('image', fileImage);

            try {
                const response = await postData(URL_API_WORKS, formData, token, true);
                userMessage('.add-photo-message',"Photo ajoutée avec succès !",'success');
                addPhotoModal.style.display = 'none';
                addNewProjectToGallery(response);
                clearPhotoPreview(modalElements);
            } catch (error) {
                console.error("Erreur:", error);
                userMessage('.add-photo-message',"Erreur d'ajout de la photo.", 'error');
            }
        });

          modalElements.backButton.addEventListener('click', () => {
            clearPhotoPreview(modalElements);
              addPhotoModal.style.display = 'none';
              showGalleryModal();
          });
      
          modalElements.closeButton.addEventListener('click', () => {
            clearPhotoPreview(modalElements);
              addPhotoModal.style.display = 'none';
          });  
          addPhotoModal.addEventListener('click', (event) => {
            const isCloseButton = modalElements.closeButton.contains(event.target);
            if (event.target === addPhotoModal || isCloseButton) {
                clearPhotoPreview(modalElements);
                addPhotoModal.style.display = 'none';  
            }
        });
          
        // Fill the drop-down list of categories
        async function loadCategories(categorySelect) {
            const categories = await getData(URL_API_CATEGORIES);
            if (!categories || categories.length === 0) return;
            const emptyOption = document.createElement('option');
            emptyOption.value = "";
            emptyOption.textContent = "";
            categorySelect.appendChild(emptyOption);
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
        loadCategories(modalElements.photoCategory);
    }
    addPhotoModal.style.display = 'flex';
 
    function clearPhotoPreview(modalElements)  {
        if (modalElements.photoPreview.src) {
            URL.revokeObjectURL(modalElements.photoPreview.src); // Release the temporary URL
        }
        modalElements.photoTitle.value = ""; 
        modalElements.photoCategory.value = ""; 
        modalElements.photoPreview.src = ""; 
        modalElements.photoPreview.style.display = 'none'; 
        modalElements.iconImage.style.display = 'block'; 
        modalElements.openPhotoButton.style.display = 'block';
        modalElements.photoInput.value = ""; 
        modalElements.descriptionImage.style.display = 'block'; 
    };
}

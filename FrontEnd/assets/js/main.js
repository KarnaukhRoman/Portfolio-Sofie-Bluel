// .assets/js/main.js
import { getData } from "./apirequests.js";
import { renderGallery, createCategoryButtons, editMode, setupLogout } from "./galleryutils.js";
import { isValidToken, isValidLogin } from "./login.js";

const URL_API_WORKS = 'http://localhost:5678/api/works';
const STORAGE_KEY_GALLERY = 'gallery';
const URL_API_CATEGORIES = 'http://localhost:5678/api/categories';
const STORAGE_KEY_CATEGORIES = 'categories';
export const URL_API_LOGIN = 'http://localhost:5678/api/users/login';


function enableEditMode() {
    document.body.classList.add('edit-mode');  // Додаємо клас для змін стилю
    document.querySelector('.filters').style.display = 'none';  // Приховуємо кнопки фільтрації
    const editModeText = document.createElement('div');
    editModeText.classList.add('edit-mode-text');
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-pen-to-square';

    // Додаємо іконку перед текстом
    editModeText.appendChild(icon);

    // Додаємо текст після іконки
    const textNode = document.createTextNode(' Mode edition');
    editModeText.appendChild(textNode);

    // Додаємо блок до тіла сторінки
    document.body.prepend(editModeText);
       // Додаємо іконку та напис поруч із "Mes Projets" у секції portfolio
       const portfolioHeading = document.querySelector('#portfolio h2');
       if (portfolioHeading) {
           const modifyWrapper = document.createElement('span');
           modifyWrapper.classList.add('modify-wrapper'); // Додаємо клас для стилізації
   
           const iconPortfolio = document.createElement('i');
           iconPortfolio.className = 'fa-regular fa-pen-to-square'; // Клас іконки Font Awesome
   
           const textPortfolio = document.createTextNode(' modifie');
   
           modifyWrapper.appendChild(iconPortfolio);
           modifyWrapper.appendChild(textPortfolio);
   
           // Додаємо wrapper після заголовка
           portfolioHeading.appendChild(modifyWrapper);
           modifyWrapper.addEventListener('click', () => {
            alert("You are in edit mode");
            });
    }
}

async function loadGallery(categoryId = null) {
    const gallery = await getData(URL_API_WORKS, STORAGE_KEY_GALLERY);
    console.log(categoryId)
    if (categoryId === "all" || categoryId === null) {
        // Show all categories
        renderGallery(gallery);
    } else {
        // Filtering by category
        const filteredGallery = gallery.filter(item => item.categoryId === Number(categoryId));
        renderGallery(filteredGallery);
    };
};

async function initCategories() {
    const categories = await getData(URL_API_CATEGORIES, STORAGE_KEY_CATEGORIES);
    createCategoryButtons(categories, loadGallery);
};
// Ініціалізація категорій та галереї
async function init() {
    if (sessionStorage.getItem('loginValid') === 'true') {
        // editMode();   // Якщо токен є і валідний, включаємо режим редагування
        setupLogout('nav a[href="login.html"]');
        enableEditMode();
        await loadGallery();
    }else{
        await initCategories(); 
        await loadGallery();     
    } 
 
    
}

// init();
document.addEventListener('DOMContentLoaded', () => {
    init(); // Ініціалізуємо після завантаження сторінки
});
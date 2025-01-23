// .assets/js/main.js
import { dataFetcher } from "./apirequests.js";
import { renderGallery, createCategoryButtons } from "./galleryutils.js";


const URL_API_WORKS = 'http://localhost:5678/api/works';
const STORAGE_KEY_GALLERY = 'gallery';
const URL_API_CATEGORIES = 'http://localhost:5678/api/categories';
const STORAGE_KEY_CATEGORIES = 'categories';


async function loadGallery(categoryId = null) {
    const gallery = await dataFetcher(URL_API_WORKS, STORAGE_KEY_GALLERY);
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
    const categories = await dataFetcher(URL_API_CATEGORIES, STORAGE_KEY_CATEGORIES);
    createCategoryButtons(categories);
    // Add event handler for buttons
    const container = document.querySelector('.filters');
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
};
// Ініціалізація категорій та галереї
async function init() {
    await initCategories(); 
    await loadGallery(); 
}

init();
// .assets/js/main.js
import { dataFetcher } from "./apirequests.js";
import { renderGallery, createCategoryButtons } from "./galleryutils.js";
import { setupLoginModal } from "./login.js";

const URL_API_WORKS = 'http://localhost:5678/api/works';
const STORAGE_KEY_GALLERY = 'gallery';
const URL_API_CATEGORIES = 'http://localhost:5678/api/categories';
const STORAGE_KEY_CATEGORIES = 'categories';


async function loadGallery(categoryId = null) {
    const gallery = await dataFetcher(URL_API_WORKS, STORAGE_KEY_GALLERY);
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
    const categories = await dataFetcher(URL_API_CATEGORIES, STORAGE_KEY_CATEGORIES);
    createCategoryButtons(categories, loadGallery);
};
// Ініціалізація категорій та галереї
async function init() {
    setupLoginModal();  // Initialize login modal
    await initCategories(); 
    await loadGallery(); 
}

init();
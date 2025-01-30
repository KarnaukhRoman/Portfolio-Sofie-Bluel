// .assets/js/main.js
import { getData, URL_API_CATEGORIES } from "./apirequests.js";
import { galleryFilter, createCategoryButtons, enableEditMode, setupLogout } from "./galleryutils.js";


async function initCategories() {
    const categories = await getData(URL_API_CATEGORIES);
    createCategoryButtons(categories);
};

async function init() {
    // If the token is present and valid, activate edit mode.
    if (sessionStorage.getItem('loginValid') === 'true') {
        setupLogout('nav a[href="login.html"]');
        enableEditMode();
        await galleryFilter();
    }else{
        await initCategories(); 
        await galleryFilter();     
    }    
}

init();

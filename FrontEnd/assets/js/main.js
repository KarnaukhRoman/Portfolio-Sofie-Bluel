// .assets/js/main.js
import { getData, URL_API_WORKS, URL_API_CATEGORIES } from "./apirequests.js";
import { galleryFilter, createCategoryButtons, enableEditMode, setupLogout } from "./galleryutils.js";

export let allGallery = [];
export async function initCategories() {
    const categories = await getData(URL_API_CATEGORIES);
    createCategoryButtons(categories);
};

export function userMessage(tag, message, type) {
    const messageElement = document.querySelector(tag);  
    if (type === 'success') {
        messageElement.innerHTML = '<i class="fa-regular fa-circle-check"></i>' + ' '+ message;
    } else {
        messageElement.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>' + ' '+ message;
    }
    messageElement.classList.add(type);
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.classList.remove(type);
    }, 4000);
};

async function init() {
    allGallery = await getData(URL_API_WORKS);
    // If the token is present and valid, activate edit mode.
    if (sessionStorage.getItem('loginValid') === 'true') {
        setupLogout('nav a[href="login.html"]');
        enableEditMode();
        galleryFilter();
    }else{
        await initCategories(); 
        galleryFilter();     
    }    
};

document.addEventListener("DOMContentLoaded", async () => {
    await init();
});

let gallery = window.localStorage.getItem('gallery');
async function loadGallery() {
    if (gallery === null) {
        gallery = await fetch(`http://localhost:5678/api/works`).then(response => response.json());
        window.localStorage.setItem('gallery', JSON.stringify(gallery));
    } else {
        gallery = JSON.parse(gallery);
    }
    console.log(gallery);
}

// Викликаємо функцію
loadGallery();
function showGallery(gallery) {
    let blockGallery = document.querySelector('.gallery');
    console.log(blockGallery);
    gallery.forEach(item => {
        let figureElement = document.createElement('figure');
        let imgElement = document.createElement('img');
        imgElement.src = item.imageUrl;
        let captionElement = document.createElement('figcaption');
        captionElement.textContent = item.title;
        blockGallery.appendChild(figureElement);
        figureElement.appendChild(imgElement);
        figureElement.appendChild(captionElement);
    });
}

showGallery(gallery);
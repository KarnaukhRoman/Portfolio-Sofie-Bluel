// .assets/js/fetchGallery.js
export async function dataFetcher(apiUrl, storageKey) {
    let fetchData = window.localStorage.getItem(storageKey);
    if (fetchData === null) {
        fetchData = await fetch(apiUrl).then(response => response.json());
        window.localStorage.setItem(storageKey, JSON.stringify(fetchData));
    } else {
        fetchData = JSON.parse(fetchData);
    }
    return fetchData;
};


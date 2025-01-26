// .assets/js/apiRequests.js
// export async function dataFetcher(apiUrl, storageKey) {
//     let fetchData = window.localStorage.getItem(storageKey);
//     if (fetchData === null) {
//         fetchData = await fetch(apiUrl).then(response => response.json());
//         window.localStorage.setItem(storageKey, JSON.stringify(fetchData));
//     } else {
//         fetchData = JSON.parse(fetchData);
//     }
//     return fetchData;
// };

export async function getData(apiUrl, storageKey) {
    let fetchData;

    if (storageKey) {
        fetchData = window.localStorage.getItem(storageKey);

        if (fetchData === null) {
            fetchData = await fetch(apiUrl).then(response => {
                if (!response.ok) {
                    throw new Error('Request error: ' + response.status);
                }
                return response.json();
            });
            window.localStorage.setItem(storageKey, JSON.stringify(fetchData));
        } else {
            fetchData = JSON.parse(fetchData);
        }
    } else {
            throw new Error('Missing parameter for storage '); 
        };

    return fetchData;
};
export async function postData(apiUrl, body) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка запиту: ' + response.status);
    }

    return response.json();
}
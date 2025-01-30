// .assets/js/apiRequests.js
export const URL_API_WORKS = 'http://localhost:5678/api/works';
export const URL_API_CATEGORIES = 'http://localhost:5678/api/categories';
export const URL_API_LOGIN = 'http://localhost:5678/api/users/login';
export const URL_API_DELETE = 'http://localhost:5678/api/works/';


export async function getData(URL_API) {
    try {
        const response = await fetch(URL_API);     
        if (!response.ok) {
            throw new Error(`Request error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetching error:', error.message);
        return error;
    }
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

export async function deleteData(apiUrl, token) {
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        
        console.log('Element successfully deleted');
        return true; 
    } catch (error) {
        console.error('Deleting error:', error.message);
        return error;
    }
}
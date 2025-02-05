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

//Function for sending both JSON and FormData
export async function postData(apiUrl, body, token = null, isFormData = false) {
    let headers = { "Accept": "application/json" };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(body);
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: isFormData ? {"Authorization": `Bearer ${token}`} : headers, // Без заголовків для FormData
            body: body,
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error request: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in postData:", error);
        throw error;
    }
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
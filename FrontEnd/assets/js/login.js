// .assets/js/login.js
import { userMessage } from "./main.js";
import { postData, URL_API_LOGIN } from "./apirequests.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email'); 

    loginForm.addEventListener('submit', (event) => {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(emailValue)) {
            event.preventDefault(); 
            emailInput.classList.add('error'); 
            alert('Veuillez entrer une adresse e-mail valide.');
        } else {
            emailInput.classList.remove('error'); 
        }
    });
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Veuillez remplir tous les champs !');
            return;
        }
        try {
            const data = await postData(URL_API_LOGIN, {
                email,
                password,
            });

            localStorage.setItem('token', data.token);

            if (isValidToken(data.token)) {
                sessionStorage.setItem('loginValid', 'true');
            }
            // alert('Connexion réussie!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.log(error);
            userMessage('.info-message','Votre e-mail ou mot de passe est incorrect', 'error');
        }
    });
});

// Token validation function
export function isValidToken(token) {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
        try {
            const payload = JSON.parse(atob(tokenParts[1])); // Decode part of the payload
            const expirationTime = payload.exp * 1000; // Convert time to milliseconds
            const currentTime = Date.now();
            // Checking for token validity by time
            if (currentTime < expirationTime) {
                return true;
            }
        } catch (e) {
            console.error('Invalid token format');
        }
    }
    return false;
}

// .assets/js/login.js

import { URL_API_LOGIN } from "./main.js";
import { postData } from "./apirequests.js";
import { editMode } from "./galleryutils.js";


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email'); // Оновлена назва змінної

    loginForm.addEventListener('submit', (event) => {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(emailValue)) {
            event.preventDefault(); // Зупиняємо відправлення форми
            emailInput.classList.add('error'); // Додаємо клас помилки
            alert('Veuillez entrer une adresse e-mail valide.');
        } else {
            emailInput.classList.remove('error'); // Видаляємо клас помилки, якщо все коректно
        }
    });
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Запобігаємо стандартній поведінці форми

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Перевірка введених даних
        if (!email || !password) {
            alert('Veuillez remplir tous les champs !');
            return;
        }
        try {
            // Викликаємо postData для логіну
            const data = await postData(URL_API_LOGIN, {
                email,
                password,
            });

            // Збереження токена
            localStorage.setItem('token', data.token);
        //     if (isValidToken(data.token)) { // Перевірка валідності токена
        //    // Встановлюємо loginValid як true тільки на поточну сесію
        //         loginValid = true;
        //     };
            if (isValidToken(data.token)) {
                sessionStorage.setItem('loginValid', 'true');
            }
            alert('Connexion réussie!');
            // editMode();
            window.location.href = 'index.html'; // Перехід на головну сторінку
            // window.location.replace('index.html');
            // window.location.href = 'index.html?edit=true';
            
        } catch (error) {
            console.log(error);
            alert('Erreur de connexion: ' + error.message);
        }
    });
});

// Функція перевірки валідності токена
export function isValidToken(token) {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
        try {
            const payload = JSON.parse(atob(tokenParts[1])); // Декодуємо частину payload
            const expirationTime = payload.exp * 1000; // Преобразуємо час в мілісекунди
            const currentTime = Date.now();

            // Перевірка на валідність токену за часом
            if (currentTime < expirationTime) {
                return true;
            }
        } catch (e) {
            console.error('Invalid token format');
        }
    }
    return false;
}

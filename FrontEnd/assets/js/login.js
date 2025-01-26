// .assets/js/login.js

import { URL_API_LOGIN } from "./main.js";
import { postData } from "./apirequests.js";

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

            alert('Connexion réussie!');
            window.location.href = 'index.html'; // Перехід на головну сторінку
        } catch (error) {
            console.log(error);
            alert('Erreur de connexion: ' + error.message);
        }
    });
});


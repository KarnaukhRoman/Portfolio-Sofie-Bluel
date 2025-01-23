// .assets/js/login.js
export function setupLoginModal() {
    const loginButton = document.querySelector('nav ul li:nth-child(3)'); // Знаходимо елемент <li>login
    const modal = document.getElementById('login-modal'); // Модальне вікно
    const sections = document.querySelectorAll('main > section'); // Всі секції в <main>
    console.log(modal);
    console.log(sections);
    // Відкрити модальне вікно
    loginButton.addEventListener('click', () => {
        console.log('Login button clicked'); // Перевірка кліку
        console.log('Before removing hidden:', modal.classList);
        sections.forEach(section => section.classList.add('hidden')); // Приховуємо секції
        modal.classList.remove('hidden'); // Показуємо модальне вікно
        console.log('After removing hidden:', modal.classList);
    });

    // Закрити модальне вікно, якщо користувач натискає поза формою
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeLoginModal(modal, sections);
        }
        console.log(event.target)
    });

}
// Закриваємо модальне вікно і повертаємо секції
function closeLoginModal(modal, sections) {
     // Приховуємо модальне вікно
    console.log(modal.classList); // Повідомлення користувачеві
    sections.forEach(section => section.classList.remove('hidden')); // Повертаємо секції
    modal.classList.add('hidden'); // Приховуємо модальне вікно
}


// .assets/js/login.js
export function setupLoginModal() {
    const loginButton = document.querySelector('nav ul li:nth-child(3)'); // Find the element <li>login
    const sections = document.querySelectorAll('main > section'); // All sections in the <main
    const main = document.querySelector('main');

    // Create and add HTML for the modal window
    const modal = createLoginModal();
    main.appendChild(modal); // Add a modal window after the last section
    console.log(modal);


    // Open a modal window
    loginButton.addEventListener('click', () => {
        // Hide all sections except 'login-modal'
        sections.forEach(section => section.classList.add('hidden')); 
        // Show the modal window
        modal.classList.remove('hidden');
    });

    // Close the modal window if the user clicks outside the form
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeLoginModal(modal, sections);
        }
        console.log(event.target)
    });

}

// Function for creating HTML for a modal window
function createLoginModal() {
    const modal = document.createElement('section');
    modal.id = 'login-modal';
    modal.className = 'hidden';
    modal.innerHTML = `
        <h2>Log In</h2>
        <form id="login-form">
            <label for="username">E-mail</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Se connecter</button>
        </form>
        <a href="#" id="forgot-password">Mot de passe oublié?</a>
    `;
    return modal;
}
// Close the modal window and return the sections
function closeLoginModal(modal, sections) {
    sections.forEach(section => section.classList.remove('hidden'));
    modal.classList.add('hidden'); 
}


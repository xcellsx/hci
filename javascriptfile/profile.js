document.addEventListener("DOMContentLoaded", function() {
    const nameElement = document.getElementById("name");
    const usernameElement = document.getElementById("username");
    const emailElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");
    const editIcon = document.getElementById("edit-icon");

    function displayProfileInfo() {
        const name = localStorage.getItem('name') || 'User';
        const username = localStorage.getItem('username') || 'Username';
        const email = localStorage.getItem('email') || 'Email';
        const password = localStorage.getItem('password') || '*******';

        nameElement.textContent = `Name: ${name}`;
        usernameElement.textContent = `Username: ${username}`;
        emailElement.textContent = `Email: ${email}`;
        passwordElement.textContent = `Password: ${password}`;
    }

    // Load values from local storage when the page loads
    window.onload = function() {
        displayProfileInfo();
    };

    editIcon.addEventListener("click", function() {
        // Create input fields for editable content
        const name = localStorage.getItem('name') || 'User';
        const username = localStorage.getItem('username') || 'Username';
        const email = localStorage.getItem('email') || 'Email';
        const password = localStorage.getItem('password') || '*******';

        nameElement.innerHTML = `<input type="text" id="nameInput" value="${name}" class="form-control">`;
        usernameElement.innerHTML = `<input type="text" id="usernameInput" value="${username}" class="form-control">`;
        emailElement.innerHTML = `<input type="email" id="emailInput" value="${email}" class="form-control">`;
        passwordElement.innerHTML = `<input type="password" id="passwordInput" value="${password}" class="form-control">`;

        // Append save button
        const saveButton = document.createElement("button");
        saveButton.className = "btn btn-primary mt-2";
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", saveProfile);
        passwordElement.appendChild(saveButton);
    });

    function saveProfile() {
        const newName = document.getElementById("nameInput").value;
        const newUsername = document.getElementById("usernameInput").value;
        const newEmail = document.getElementById("emailInput").value;
        const newPassword = document.getElementById("passwordInput").value;

        // Save updated user data to localStorage
        localStorage.setItem('name', newName);
        localStorage.setItem('username', newUsername);
        localStorage.setItem('email', newEmail);
        localStorage.setItem('password', newPassword);

        // Display updated user data
        nameElement.textContent = `Name: ${newName}`;
        usernameElement.textContent = `Username: ${newUsername}`;
        emailElement.textContent = `Email: ${newEmail}`;
        passwordElement.textContent = `Password: ********`;

        // Show confirmation modal (optional)
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();
    }
});

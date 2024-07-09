document.addEventListener('DOMContentLoaded', () => {
    // Load the user information from localStorage
    loadUserInfo();

    document.getElementById('saveButton').addEventListener('click', function() {
        // Get the values from the form
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phoneNumber = document.getElementById('phone').value;
        const birthday = document.getElementById('birthday').value;

        // Create an object with the new user information
        const userInfo = {
            name: name,
            username: username,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            birthday: birthday,
        };

        // Save the user information to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Show the confirmation modal
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();
    });
});

function loadUserInfo() {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        document.getElementById('name').value = userInfo.name;
        document.getElementById('username').value = userInfo.username;
        document.getElementById('email').value = userInfo.email;
        document.getElementById('password').value = userInfo.password;
        document.getElementById('phone').value = userInfo.phoneNumber;
        document.getElementById('birthday').value = userInfo.birthday;
    }
}

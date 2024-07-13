// Function to load the user's name from local storage
function loadUserName() {
    const userName = localStorage.getItem('name') || 'Guest';
    document.getElementById('welcomeMessage').textContent = `Welcome, ${userName}`;
}

// Load the user's name when the page loads
window.onload = function() {
    loadUserName();
};

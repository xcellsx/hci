function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value;

    if (!emailValue.includes('@')) {
        alert('Please enter a valid email address with "@" symbol.');
        return false;
    }

    alert('Email is valid.');
    // Add form submission logic here if needed
    return true;
}

// function generateOTP() {
//     // Generate a 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     alert('Your OTP is: ' + otp);

//     // Store the OTP in local storage or a variable for verification
//     localStorage.setItem('generatedOTP', otp);
// }

// function verifyOTP() {
//     const enteredOTP = document.getElementById('otp-input').value;
//     const generatedOTP = localStorage.getItem('generatedOTP');

//     if (enteredOTP == generatedOTP) {
//         document.getElementById('message').textContent = 'OTP verified successfully!';
//     } else {
//         document.getElementById('message').textContent = 'Invalid OTP. Please try again.';
//     }
//     toggleSubmitButton();
// }

// function resendOTP() {
//     generateOTP();
// }

// function toggleSubmitButton() {
//     // const otpInput = document.getElementById('otp-input').value;
//     // const generatedOTP = localStorage.getItem('generatedOTP');
//     // const isValidOtp = otpInput === generatedOTP; 
//     const termsCheckbox = document.getElementById('termsCheckbox').checked;
//     const nextButton = document.getElementById('nextButton');

//     nextButton.disabled = !(isValidOtp && termsCheckbox);
// }

// document.getElementById('termsCheckbox').addEventListener('change', toggleSubmitButton);
// // document.getElementById('otp-input').addEventListener('input', toggleSubmitButton);

// function toggleSubmitButton() {
//     const termsCheckbox = document.getElementById('termsCheckbox').checked;
//     const name = document.getElementById('name').value;
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     // Add other fields as needed

//     const nextButton = document.getElementById('nextButton');

//     // Check if all fields are filled and the checkbox is checked
//     nextButton.disabled = !(termsCheckbox && name && username && email && password);
// }

// // Attach event listeners to input fields
// document.querySelectorAll('.form input').forEach(input => {
//     input.addEventListener('input', toggleSubmitButton);
// });

// document.getElementById('termsCheckbox').addEventListener('change', toggleSubmitButton);

// Function to save input values to local storage
 // Function to save input values to local storage
function saveToLocalStorage() {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    localStorage.setItem('name', name);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
}

// Function to load input values from local storage
function loadFromLocalStorage() {
    document.getElementById('name').value = localStorage.getItem('name') || '';
    document.getElementById('username').value = localStorage.getItem('username') || '';
    document.getElementById('email').value = localStorage.getItem('email') || '';
    document.getElementById('password').value = localStorage.getItem('password') || '';
}

// Attach event listeners to save data
document.querySelectorAll('.form input').forEach(input => {
    input.addEventListener('input', function() {
        saveToLocalStorage();
    });
});

window.onload = function() {
    loadFromLocalStorage();
};

    function goToNextPage() {
        window.location.href = 'owncategories.html';
    }

    function toggleSubmitButton() {
        const termsCheckbox = document.getElementById('termsCheckbox').checked;
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const nextButton = document.getElementById('nextButton');

        nextButton.disabled = !(termsCheckbox && name && username && email && password);
    }

    // Load values from local storage when the page loads
    window.onload = function() {
        loadFromLocalStorage();

        // Attach event listeners to input fields
        document.querySelectorAll('.form input').forEach(input => {
            input.addEventListener('input', function() {
                saveToLocalStorage();
                toggleSubmitButton();
            });
        });

        document.getElementById('termsCheckbox').addEventListener('change', toggleSubmitButton);
    };

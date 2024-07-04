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

function generateOTP() {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    alert('Your OTP is: ' + otp);

    // Store the OTP in local storage or a variable for verification
    localStorage.setItem('generatedOTP', otp);
}

function verifyOTP() {
    const enteredOTP = document.getElementById('otp-input').value;
    const generatedOTP = localStorage.getItem('generatedOTP');

    if (enteredOTP == generatedOTP) {
        document.getElementById('message').textContent = 'OTP verified successfully!';
    } else {
        document.getElementById('message').textContent = 'Invalid OTP. Please try again.';
    }
    toggleSubmitButton();
}

function resendOTP() {
    generateOTP();
}

function toggleSubmitButton() {
    const otpInput = document.getElementById('otp-input').value;
    const generatedOTP = localStorage.getItem('generatedOTP');
    const isValidOtp = otpInput === generatedOTP; 
    const termsCheckbox = document.getElementById('termsCheckbox').checked;
    const nextButton = document.getElementById('nextButton');

    nextButton.disabled = !(isValidOtp && termsCheckbox);
}

document.getElementById('termsCheckbox').addEventListener('change', toggleSubmitButton);
document.getElementById('otp-input').addEventListener('input', toggleSubmitButton);

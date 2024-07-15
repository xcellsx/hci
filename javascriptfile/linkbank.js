document.addEventListener('DOMContentLoaded', function() {
    loadBankAccounts();
});

function loadBankAccounts() {
    const bankCardsRow = document.getElementById('bankCardsRow');
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];

    bankCardsRow.innerHTML = ''; // Clear existing cards

    bankAccounts.forEach(account => {
        const cardHtml = `
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${account.bankName}</h5>
                        <p class="card-text">Account Number: ${account.accountNumber}</p>
                        <p class="card-text">Amount: $${account.amount.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;
        bankCardsRow.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Store the number of active accounts
    localStorage.setItem('activeAccounts', bankAccounts.length);
}

document.getElementById('addBank').addEventListener('click', function() {
    var bankModal = new bootstrap.Modal(document.getElementById('bankModal'));
    bankModal.show();
});

document.getElementById('generateOtpButton').addEventListener('click', function() {
    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    alert('Generated OTP: ' + otp); // Display OTP as a popup
    console.log('Generated OTP:', otp); // For demonstration purposes, display the OTP in the console

    // Display the OTP section
    document.getElementById('otpSection').style.display = 'block';
    document.getElementById('generateOtpButton').style.display = 'none';
    document.getElementById('verifyButton').style.display = 'block';

    // Save the generated OTP in a hidden field or variable for verification
    document.getElementById('bankForm').dataset.otp = otp;
});

document.getElementById('bankForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Verify the OTP
    const enteredOtp = document.getElementById('otp').value;
    const generatedOtp = document.getElementById('bankForm').dataset.otp;
    
    if (enteredOtp === generatedOtp) {
        alert('Bank account linked successfully!');
        
        // Get bank details
        const bankName = document.getElementById('bankName').value;
        const accountNumber = document.getElementById('accountNumber').value;
        const amount = parseFloat((Math.random() * (10000 - 100) + 100).toFixed(2)); // Generate random amount between 100 and 10000

        // Create a new card
        const cardHtml = `
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${bankName}</h5>
                        <p class="card-text">Account Number: ${accountNumber}</p>
                        <p class="card-text">Amount: $${amount.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;

        // Append the card to the bankCardsRow
        document.getElementById('bankCardsRow').insertAdjacentHTML('beforeend', cardHtml);

        // Store the bank details in localStorage
        const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
        bankAccounts.push({ bankName, accountNumber, amount });
        localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));

        // Update the number of active accounts
        localStorage.setItem('activeAccounts', bankAccounts.length);

        // Reset the form
        document.getElementById('bankForm').reset();
        document.getElementById('otpSection').style.display = 'none';
        document.getElementById('generateOtpButton').style.display = 'block';
        document.getElementById('verifyButton').style.display = 'none';

        // Close the modal
        var bankModal = bootstrap.Modal.getInstance(document.getElementById('bankModal'));
        bankModal.hide();
    } else {
        alert('Invalid OTP. Please try again.');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadBankAccounts();

    // Add click event listener to the addBank SVG
    document.getElementById('addBank').addEventListener('click', showBankModal);

    // Validate account number length and display digit count
    document.getElementById('linkAccountNumber').addEventListener('input', function() {
        const accountNumber = this.value.replace(/\D/g, ''); // Remove all non-digit characters
        const digitCount = accountNumber.length;
        document.getElementById('accountNumberCounter').textContent = `${digitCount} / 12`;
        if (digitCount < 6 || digitCount > 12) {
            this.setCustomValidity("Account number must be between 6 and 12 digits.");
        } else {
            this.setCustomValidity("");
        }
    });

    // Format card number with spaces every 4 digits
    document.getElementById('linkCardNum').addEventListener('input', function() {
        let cardNumber = this.value.replace(/\D/g, ''); // Remove all non-digit characters
        if (cardNumber.length > 16) {
            cardNumber = cardNumber.slice(0, 16); // Ensure it doesn't exceed 16 digits
        }
        this.value = cardNumber.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
    });

    // Validate card expiry date
    document.getElementById('linkCardExp').addEventListener('input', function() {
        const expiryDate = this.value;
        const [month, year] = expiryDate.split('/').map(Number);
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear() % 100; // Get last two digits of the year

        if (
            !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) || // Match MM/YY format
            (year < currentYear || (year === currentYear && month <= currentMonth))
        ) {
            this.setCustomValidity("Invalid expiry date. The date must be in MM/YY format and not in the current month/year.");
        } else {
            this.setCustomValidity("");
        }
    });

    // Handle OTP generation and verification
    document.getElementById('generateOtpButton').addEventListener('click', function() {
        generateOtp();
    });

    document.getElementById('regenerateOtpButton').addEventListener('click', function() {
        generateOtp();
    });

    document.getElementById('bankForm').addEventListener('submit', function(event) {
        event.preventDefault();
        verifyOtp();
    });

    // Confirm deletion
    document.getElementById('confirmDeleteButton').addEventListener('click', function() {
        const index = document.getElementById('confirmDeleteModal').dataset.index;
        deleteBankAccount(index);
        var confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        confirmDeleteModal.hide();
    });
});

function showBankModal() {
    var bankModal = new bootstrap.Modal(document.getElementById('bankModal'));
    bankModal.show();
}

function generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    alert('Generated OTP: ' + otp); // Display OTP as a popup
    console.log('Generated OTP:', otp); // For demonstration purposes, display the OTP in the console

    // Display the OTP section
    document.getElementById('otpSection').style.display = 'block';
    document.getElementById('generateOtpButton').style.display = 'none';
    document.getElementById('verifyButton').style.display = 'block';

    // Save the generated OTP in a hidden field or variable for verification
    document.getElementById('bankForm').dataset.otp = otp;

    // Enable the regenerate OTP button after 10 seconds
    setTimeout(function() {
        document.getElementById('regenerateOtpButton').style.display = 'block';
    }, 10000);
}

function verifyOtp() {
    const enteredOtp = document.getElementById('otp').value;
    const generatedOtp = document.getElementById('bankForm').dataset.otp;

    if (enteredOtp === generatedOtp) {
        alert('Bank account linked successfully!');

        // Get bank details
        const bankName = document.getElementById('linkBankName').value;
        const accountNumber = document.getElementById('linkAccountNumber').value.replace(/\s/g, ''); // Remove spaces for storage
        const cardNumber = document.getElementById('linkCardNum').value.replace(/\s/g, ''); // Remove spaces for storage
        const cardExpiry = document.getElementById('linkCardExp').value; // Get the card expiry date
        const amount = parseFloat((Math.random() * (10000 - 100) + 100).toFixed(2)); // Generate random amount between 100 and 10000

        // Store the bank details in localStorage
        const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
        bankAccounts.push({ bankName, accountNumber, cardNumber, cardExpiry, amount });
        localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));

        // Reload the bank accounts to display the new card
        loadBankAccounts();

        // Reset the form
        document.getElementById('bankForm').reset();
        document.getElementById('otpSection').style.display = 'none';
        document.getElementById('generateOtpButton').style.display = 'block';
        document.getElementById('verifyButton').style.display = 'none';
        document.getElementById('regenerateOtpButton').style.display = 'none';

        // Close the modal
        var bankModal = bootstrap.Modal.getInstance(document.getElementById('bankModal'));
        bankModal.hide();
    } else {
        alert('Invalid OTP. Please try again.');
    }
}

function loadBankAccounts() {
    const bankCardsRow = document.getElementById('bankCardsRow');
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];

    // Update the active accounts counter
    document.getElementById('activeAccountsCounter').textContent = `Active Accounts: ${bankAccounts.length}`;

    // Clear existing cards
    bankCardsRow.innerHTML = '';

    bankAccounts.forEach((account, index) => {
        const cardColor = getBankColor(account.bankName);
        const textColor = (cardColor === 'var(--blue)' || cardColor === 'var(--olive)' || cardColor === 'var(--white)') ? 'var(--dark-blue)' : 'var(--white)';

        const cardHtml = `
            <div class="col-md-4" data-index="${index}">
                <div class="card mb-3 swipe-card" style="background-color: ${cardColor}; color: ${textColor};">
                    <div class="card-body">
                        <div class="box">
                            <p class="card-text"><i class="fas fa-university" style="margin-right: 1em;"></i>${account.accountNumber}</p>
                            <p class="card-text" style="font-weight: bold;">${account.bankName}</p>
                        </div>

                        <div class="box">
                            <p class="card-text">${formatCardNumber(account.cardNumber)}</p>
                            <p class="card-text" style="font-weight: bold;">$${account.amount.toFixed(2)}</p>
                        </div>
                        <div class="box">
                            <p class="card-text">Expires: ${account.cardExpiry}</p>
                        </div>
                        <button class="btn btn-danger delete-account" style="display: none;">Delete</button>
                    </div>
                </div>
            </div>
        `;
        bankCardsRow.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Attach swipe event listeners to each card
    document.querySelectorAll('.swipe-card').forEach(card => {
        const hammer = new Hammer(card);
        hammer.on('swiperight', function() {
            const deleteButton = card.querySelector('.delete-account');
            deleteButton.style.display = 'block';
            card.classList.add('swipe-right');
        });

        // Attach click event listener to each card to show edit/delete modal
        card.addEventListener('click', function() {
            const index = card.closest('.col-md-4').dataset.index;
            showEditDeleteModal(index);
        });
    });

    // Attach delete event listeners to each delete button
    document.querySelectorAll('.delete-account').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.col-md-4');
            const index = card.dataset.index;
            deleteBankAccount(index);
        });
    });
}

function getBankColor(bankName) {
    switch (bankName.toLowerCase()) {
        case 'ocbc':
            return 'var(--dark-blue)';
        case 'dbs':
            return 'var(--blue)';
        case 'maybank':
            return 'var(--brown)';
        case 'uob':
            return 'var(--olive)';
        case 'standard chartered':
            return 'var(--dark-green)';
        case 'posb':
            return 'var(--blue)';
        default:
            return 'var(--white)'; // Default color if bank name doesn't match
    }
}

function confirmDelete(index) {
    document.getElementById('confirmDeleteModal').dataset.index = index;
    var confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmDeleteModal.show();
}

function deleteBankAccount(index) {
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    bankAccounts.splice(index, 1);
    localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
    loadBankAccounts();
}

function showEditDeleteModal(index) {
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    const account = bankAccounts[index];

    // Populate the modal with the account details
    document.getElementById('editBankName').value = account.bankName;
    document.getElementById('editAccountNumber').value = account.accountNumber;
    document.getElementById('editCardNum').value = formatCardNumber(account.cardNumber);
    document.getElementById('editCardExp').value = account.cardExpiry;

    // Show the modal
    var editDeleteModal = new bootstrap.Modal(document.getElementById('editDeleteModal'));
    editDeleteModal.show();

    // Handle form submission to save changes
    document.getElementById('editDeleteForm').onsubmit = function(event) {
        event.preventDefault();
        saveBankAccountChanges(index);
        editDeleteModal.hide();
    };

    // Handle delete button click
    document.getElementById('deleteBankButton').onclick = function() {
        deleteBankAccount(index);
        editDeleteModal.hide();
    };
}

function saveBankAccountChanges(index) {
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    const account = bankAccounts[index];

    account.bankName = document.getElementById('editBankName').value;
    account.accountNumber = document.getElementById('editAccountNumber').value;
    account.cardNumber = document.getElementById('editCardNum').value.replace(/\s/g, ''); // Remove spaces for storage
    account.cardExpiry = document.getElementById('editCardExp').value;

    bankAccounts[index] = account;
    localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
    loadBankAccounts();
}

function formatCardNumber(cardNumber) {
    return cardNumber.replace(/(.{4})/g, '$1 ').trim();
}

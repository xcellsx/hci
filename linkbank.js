document.addEventListener('DOMContentLoaded', () => {
    const bankForm = document.getElementById('bankForm');

    bankForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const bankName = document.getElementById('bankName').value;
        const accountNumber = document.getElementById('accountNumber').value;
        const ifscCode = document.getElementById('ifscCode').value;
        const accountHolder = document.getElementById('accountHolder').value;

        // Create bank account object
        const bankAccount = {
            bankName: bankName,
            accountNumber: accountNumber,
            ifscCode: ifscCode,
            accountHolder: accountHolder
        };

        // Save bank account to localStorage
        let bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
        bankAccounts.push(bankAccount);
        localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));

        // Reset form
        bankForm.reset();

        // Inform user (optional)
        alert('Bank account linked successfully!');
    });
});

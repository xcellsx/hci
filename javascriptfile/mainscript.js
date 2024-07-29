// mainscript.js
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

function loadUserName() {
    const userName = localStorage.getItem('name') || 'Guest';
    document.getElementById('welcomeMessage').textContent = `Welcome, ${userName}`;
    document.getElementById('modalUserName').textContent = userName;
}

window.onload = function() {
    loadUserName();
};

document.addEventListener('DOMContentLoaded', function() {
    displayBankDetails();
    displayTodaysTransactions();
});

function displayBankDetails() {
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselIndicators = document.querySelector('.carousel-indicators');

    // Clear existing items
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';

    if (bankAccounts.length === 0) {
        showAddBankModal();
    } else {
        bankAccounts.forEach((account, index) => {
            const isActive = index === 0 ? 'active' : '';
            const cardColor = getBankColor(account.bankName);
            const textColor = (cardColor === 'var(--dark-blue)' || cardColor === 'var(--brown)' || cardColor === 'var(--dark-green)') ? 'var(--white)' : 'var(--dark-blue)';

            const itemHtml = `
                <div class="carousel-item ${isActive}">
                    <div class="bank-card" style="background-color: ${cardColor}; color: ${textColor};">
                        <div class="bank-card-name right-align">${account.bankName}</div>
                        <div class="bank-card-number">${formatCardNumber(account.cardNumber)}</div>
                        <div class="card-content">
                            <div class="bank-card-expiry">Expires: ${account.cardExpiry || 'N/A'}</div>
                            <div class="bank-amount right-align">$${account.amount.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;

            carouselInner.insertAdjacentHTML('beforeend', itemHtml);
            
            const indicatorHtml = `
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${isActive}" aria-current="true" aria-label="Slide ${index + 1}"></button>
            `;
            carouselIndicators.insertAdjacentHTML('beforeend', indicatorHtml);
        });
    }
}

function formatCardNumber(cardNumber) {
    return cardNumber.replace(/(.{4})/g, '$1 ').trim();
}

function displayTodaysTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionContainer = document.querySelector('.transaction');

    transactionContainer.innerHTML = ''; // Clear existing transactions

    transactions.forEach(transaction => {
        const cardColor = getBankColor(transaction.bank);
        const textColor = (cardColor === 'var(--blue)' || cardColor === 'olive' || cardColor === 'white') ? 'var(--dark-blue)' : 'var(--white)';

        const transactionCard = document.createElement('div');
        transactionCard.className = 'transaction-card';
        transactionCard.style.backgroundColor = cardColor;
        transactionCard.style.color = textColor;
        transactionCard.innerHTML = `
            <div class="transaction-name">${transaction.name}</div>
            <div class="transaction-date">${transaction.date}</div>
            <div class="transaction-cat">${transaction.category}</div>
            <div class="transaction-content box">
                <div class="transaction-bank"><b>${transaction.bank}</b></div>
                <div class="transaction-amount"><b>$${transaction.amount}</b></div>
            </div>
        `;

        transactionContainer.appendChild(transactionCard);
    });
}

function showAddBankModal() {
    const addBankModal = new bootstrap.Modal(document.getElementById('addBankModal'));
    addBankModal.show();
}

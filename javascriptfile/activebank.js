document.addEventListener('DOMContentLoaded', function() {
    loadBankAccounts();
    renderChart();
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
                    </div>
                </div>
            </div>
        `;
        bankCardsRow.insertAdjacentHTML('beforeend', cardHtml);
    });

    renderChart(); // Re-render chart with updated data
}

function renderChart() {
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    console.log("Bank Accounts: ", bankAccounts); // Debugging: check bank account data

    // Dummy data for example purposes
    const categoryTotals = {
        'Category 1': 1000,
        'Category 2': 1500,
        'Category 3': 500
    };
    
    console.log("Category Totals: ", categoryTotals); // Debugging: check category totals

    // Calculate total amount
    const totalAmount = Object.values(categoryTotals).reduce((acc, val) => acc + val, 0);
    console.log("Total Amount: ", totalAmount); // Debugging: check total amount

    // Prepare data for Chart.js
    const ctx = document.getElementById('accountChart').getContext('2d');
    console.log("Canvas Context: ", ctx); // Debugging: check canvas context

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                label: 'Category Breakdown',
                data: Object.values(categoryTotals),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed) {
                                label += `${context.parsed.toFixed(2)} USD`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

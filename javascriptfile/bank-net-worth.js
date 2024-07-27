document.addEventListener('DOMContentLoaded', function () {
    const incomeElement = document.getElementById("incomeDisplay");
    const profileData = JSON.parse(localStorage.getItem('aboutData')) || {};
    const income = parseFloat(profileData.income) || 0;
    incomeElement.textContent = `$${income.toFixed(2)}`;

    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const bankInfoContainer = document.querySelector('.box');

    // Calculate total outflow
    const totalOutflow = transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

    // Add the inflow vs outflow pie chart
    const inflowOutflowContainer = document.createElement('div');
    inflowOutflowContainer.innerHTML = `
        <canvas id="inflowOutflowChart" height="300"></canvas>
    `;
    bankInfoContainer.appendChild(inflowOutflowContainer);

    const inflowOutflowCtx = document.getElementById('inflowOutflowChart').getContext('2d');
    new Chart(inflowOutflowCtx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, totalOutflow],
                backgroundColor: ['#7D8274', '#435059'],
                hoverBackgroundColor: ['#7D8274', '#435059']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Income vs Expenses'
                }
            }
        }
    });

    // Calculate and display total amounts spent for each bank
    bankAccounts.forEach((account, index) => {
        const totalSpent = calculateTotalSpent(account.bankName);
        const bankInfoDiv = document.createElement('div');
        bankInfoDiv.classList.add('bank-info');

        bankInfoDiv.innerHTML = `
            <h3>${account.bankName}</h3>
            <p id="totalSpentBank${index + 1}">Total amount spent: $${totalSpent.toFixed(2)}</p>
            <canvas id="monthlySpendingBank${index + 1}Chart" height="300"></canvas>
        `;

        bankInfoContainer.appendChild(bankInfoDiv);

        // Generate monthly spending chart for each bank
        generateMonthlySpendingChart(account.bankName, `monthlySpendingBank${index + 1}Chart`);
    });

    // If no bank accounts found, display a message
    if (bankAccounts.length === 0) {
        const noBankElement = document.createElement('p');
        noBankElement.textContent = 'No bank accounts found.';
        bankInfoContainer.appendChild(noBankElement);
    }

    function calculateTotalSpent(bankName) {
        return transactions
            .filter(transaction => transaction.bank === bankName)
            .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    }

    function generateMonthlySpendingChart(bankName, chartId) {
        const monthlySpending = {};

        // Initialize monthlySpending with zeros for each month from Jan to Dec
        for (let month = 0; month < 12; month++) {
            const monthYear = `${new Date().getFullYear()}-${month + 1}`;
            monthlySpending[monthYear] = 0;
        }

        transactions.forEach(transaction => {
            if (transaction.bank === bankName) {
                const date = new Date(transaction.date);
                const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

                if (!monthlySpending[monthYear]) {
                    monthlySpending[monthYear] = 0;
                }
                monthlySpending[monthYear] += parseFloat(transaction.amount);
            }
        });

        const sortedMonths = Object.keys(monthlySpending).sort((a, b) => new Date(a) - new Date(b));

        const labels = sortedMonths.map(monthYear => {
            const [year, month] = monthYear.split('-');
            const date = new Date(year, month - 1);
            return `${date.toLocaleString('default', { month: 'short' })} ${year}`;
        });

        const data = sortedMonths.map(month => monthlySpending[month]);

        const ctx = document.getElementById(chartId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Monthly Spending in ${bankName}`,
                    data: data,
                    borderColor: 'var(--dark-blue)',
                    backgroundColor: 'rgba(67, 80, 89, 0.2)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Monthly Spending in ${bankName}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount Spent ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    }
                }
            }
        });
    }
});

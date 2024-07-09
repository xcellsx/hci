document.addEventListener('DOMContentLoaded', () => {
    // Retrieve bank accounts from localStorage
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    const bankAccountsContainer = document.getElementById('bankAccounts');

    // Display bank account cards
    bankAccounts.forEach(account => {
        const cardHtml = `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${account.bankName}</h5>
                        <p class="card-text"><strong>Account Number:</strong> ${account.accountNumber}</p>
                        <p class="card-text"><strong>IFSC Code:</strong> ${account.ifscCode}</p>
                        <p class="card-text"><strong>Account Holder:</strong> ${account.accountHolder}</p>
                    </div>
                </div>
            </div>
        `;
        bankAccountsContainer.innerHTML += cardHtml;
    });

    // Example data
    const expenseData = {
        labels: ['Food', 'Transport', 'Leisure'],
        amounts: [300, 150, 250], // Example amounts for each category
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)'
        ]
    };

    // Calculate total amount
    const totalAmount = expenseData.amounts.reduce((acc, amount) => acc + amount, 0);

    // Display total amount
    const totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.textContent = `Total Amount Spent: $${totalAmount}`;

    // Display breakdown
    const breakdownElement = document.getElementById('breakdown');
    breakdownElement.innerHTML = expenseData.labels.map((label, index) => {
        return `<p>${label}: $${expenseData.amounts[index]}</p>`;
    }).join('');

    // Doughnut chart data
    const data = {
        labels: expenseData.labels,
        datasets: [{
            data: expenseData.amounts,
            backgroundColor: expenseData.backgroundColor,
            borderColor: expenseData.borderColor,
            borderWidth: 1
        }]
    };

    // Config for the doughnut chart
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                },
                // Center text
                beforeDraw: (chart) => {
                    const width = chart.width;
                    const height = chart.height;
                    const ctx = chart.ctx;
                    ctx.restore();
                    const fontSize = (height / 114).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";

                    const text = `Total: $${totalAmount}`;
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 2;

                    ctx.fillText(text, textX, textY);

                    // Draw the breakdown text
                    const lineHeight = fontSize * 1.5;
                    expenseData.labels.forEach((label, index) => {
                        const breakdownText = `${label}: $${expenseData.amounts[index]}`;
                        const breakdownTextX = Math.round((width - ctx.measureText(breakdownText).width) / 2);
                        const breakdownTextY = textY + lineHeight * (index + 1);
                        ctx.fillText(breakdownText, breakdownTextX, breakdownTextY);
                    });

                    ctx.save();
                }
            }
        }
    };

    // Render the doughnut chart
    const doughnutChart = new Chart(
        document.getElementById('doughnutChart'),
        config
    );
});

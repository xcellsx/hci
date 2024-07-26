document.addEventListener('DOMContentLoaded', function() {
    // Define the months and randomly generate spending amounts
    const months = ['May-2024', 'Jun-2024', 'Jul-2024', 'Aug-2024'];
    const categories = ['Food', 'Transport', 'Groceries', 'Entertainment', 'Utilities'];

    // Randomly generate spending amounts for each month
    const spendingAmounts = [
        (Math.random() * (800 - 500) + 500).toFixed(2),  // Random amount between 500 and 800 for May
        (Math.random() * (800 - 500) + 500).toFixed(2),  // Random amount between 500 and 800 for June
        (Math.random() * (800 - 500) + 500).toFixed(2),  // Random amount between 500 and 800 for July
        (Math.random() * (500 - 300) + 300).toFixed(2)   // Random amount between 300 and 500 for August (lowest)
    ];

    // Randomly generate spending amounts for each category per month
    const categorySpending = {};
    categories.forEach(category => {
        categorySpending[category] = months.map(() => (Math.random() * (300 - 50) + 50).toFixed(2));
    });

    const formattedMonths = months.map(monthYear => {
        const [month, year] = monthYear.split('-');
        const date = new Date(`${month} 1, ${year}`);
        return `${date.toLocaleString('default', { month: 'short' })} ${year}`;
    });

    // Calculate the total amount spent
    const totalSpent = spendingAmounts.reduce((total, amount) => total + parseFloat(amount), 0).toFixed(2);

    // Display the total amount spent
    const totalSpentElement = document.createElement('h2');
    totalSpentElement.textContent = `Total Spent: $${totalSpent}`;
    document.querySelector('.box').prepend(totalSpentElement);

    // Generate the total monthly spending chart
    const ctxTotal = document.getElementById('monthlySpendingChart').getContext('2d');
    new Chart(ctxTotal, {
        type: 'line',
        data: {
            labels: formattedMonths,
            datasets: [{
                label: 'Monthly Spending',
                data: spendingAmounts,
                borderColor: '#435059',
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
                    text: 'Monthly Spending Over Time'
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

    // Generate charts for each category
    categories.forEach(category => {
        const categoryCanvas = document.createElement('canvas');
        categoryCanvas.id = `${category}SpendingChart`;
        categoryCanvas.height = 300; // Set height for category charts
        document.querySelector('.box').appendChild(categoryCanvas);

        const ctxCategory = categoryCanvas.getContext('2d');
        new Chart(ctxCategory, {
            type: 'line',
            data: {
                labels: formattedMonths,
                datasets: [{
                    label: `${category} Spending`,
                    data: categorySpending[category],
                    borderColor: getRandomColor(),
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
                        text: `${category} Spending Over Time`
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
    });

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});

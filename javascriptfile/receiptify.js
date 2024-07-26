document.addEventListener('DOMContentLoaded', function () {
    // Save categories, saving months, and spending months data to localStorage
    const categories = [
        { name: 'Food', totalSpent: 500 },
        { name: 'Transport', totalSpent: 300 },
        { name: 'Groceries', totalSpent: 400 },
        // Add more categories as needed
    ];
    localStorage.setItem('categories', JSON.stringify(categories));

    const savingMonths = [
        { name: 'January', amountSaved: 200 },
        { name: 'February', amountSaved: 300 },
        { name: 'March', amountSaved: 150 },
        // Add more months as needed
    ];
    localStorage.setItem('savingMonths', JSON.stringify(savingMonths));

    const spendingMonths = [
        { name: 'April', amountSpent: 700 },
        { name: 'May', amountSpent: 800 },
        { name: 'June', amountSpent: 900 },
        // Add more months as needed
    ];
    localStorage.setItem('spendingMonths', JSON.stringify(spendingMonths));

    displayTopCategories();
    displayTopSavingMonths();
    displayTopSpendingMonths();
    displayCompletedGoals();
    generateMonthlyExpenseChart();

    function displayTopCategories() {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        const topCategories = categories.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);

        const categoryCards = document.querySelectorAll('.r-cat-card');
        topCategories.forEach((category, index) => {
            categoryCards[index].innerHTML = `
                <p>${category.name}</p>
                <p style="text-align: right;"><b>$${category.totalSpent.toFixed(2)}</b></p>
            `;
        });
    }

    function displayTopSavingMonths() {
        const savingMonths = JSON.parse(localStorage.getItem('savingMonths')) || [];
        const topSavingMonths = savingMonths.sort((a, b) => b.amountSaved - a.amountSaved).slice(0, 3);

        const savingCards = document.querySelectorAll('.r-save-card');
        topSavingMonths.forEach((month, index) => {
            savingCards[index].innerHTML = `
                <p>${month.name}</p>
                <p style="text-align: right;"><b>$${month.amountSaved.toFixed(2)}</b></p>
            `;
        });
    }

    function displayTopSpendingMonths() {
        const spendingMonths = JSON.parse(localStorage.getItem('spendingMonths')) || [];
        const topSpendingMonths = spendingMonths.sort((a, b) => b.amountSpent - a.amountSpent).slice(0, 3);

        const spendingCards = document.querySelectorAll('.r-spend-card');
        topSpendingMonths.forEach((month, index) => {
            spendingCards[index].innerHTML = `
                <p>${month.name}</p>
                <p style="text-align: right;"><b>$${month.amountSpent.toFixed(2)}</b></p>
            `;
        });
    }

    function displayCompletedGoals() {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);

        const goalCardsContainer = document.querySelector('.completed-goals-container');
        goalCardsContainer.innerHTML = ''; // Clear existing cards

        if (completedGoals.length > 0) {
            completedGoals.forEach(goal => {
                const goalCard = document.createElement('div');
                goalCard.classList.add('r-goal-card');
                goalCard.innerHTML = `
                    <p>${goal.category}</p>
                    <p style="font-size: 0.75em;">${goal.endDate}</p>
                    <p style="text-align: right;"><b>$${goal.targetAmount.toFixed(2)}</b></p>
                `;
                goalCardsContainer.appendChild(goalCard);
            });
        } else {
            const noGoalsCard = document.createElement('div');
            noGoalsCard.classList.add('r-goal-card');
            noGoalsCard.innerHTML = '<p>No completed goals</p>';
            goalCardsContainer.appendChild(noGoalsCard);
        }
    }

    function generateMonthlyExpenseChart() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const monthlyExpenses = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!monthlyExpenses[monthYear]) {
                monthlyExpenses[monthYear] = 0;
            }
            monthlyExpenses[monthYear] += parseFloat(transaction.amount);
        });

        const labels = Object.keys(monthlyExpenses);
        const data = Object.values(monthlyExpenses);

        const ctx = document.getElementById('monthlyExpenseChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Amount Spent',
                    data: data,
                    borderColor: 'var(--dark-blue)',
                    backgroundColor: 'rgba(67, 80, 89, 0.2)'
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
                        text: 'Monthly Expenses'
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

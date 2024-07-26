document.addEventListener('DOMContentLoaded', function() {
    let currentWeekStartDate = new Date();
    const weekContainer = document.getElementById('weekContainer');
    let selectedDateElement = null;
    const totalAmountElement = document.getElementById('totalAmount');

    generateWeekDates(currentWeekStartDate);

    // Create a Hammer.js instance
    const hammer = new Hammer(weekContainer);
    hammer.on('swipeleft', function() {
        changeWeek(1); // Go to the next week
    });

    hammer.on('swiperight', function() {
        changeWeek(-1); // Go to the previous week
    });

    function changeWeek(offset) {
        currentWeekStartDate.setDate(currentWeekStartDate.getDate() + (offset * 7));
        generateWeekDates(currentWeekStartDate);
    }

    function generateWeekDates(startDate) {
        weekContainer.innerHTML = ''; // Clear existing dates
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date(); // Current date

        // Calculate the date of the Monday of the current week
        const currentDay = startDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const lastMonday = new Date(startDate);
        lastMonday.setDate(startDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

        // Generate dates for the week starting from Monday
        for (let i = 0; i < 7; i++) {
            const date = new Date(lastMonday);
            date.setDate(lastMonday.getDate() + i);

            const isToday = (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate());

            const dayElement = document.createElement('div');
            dayElement.className = 'dates';
            dayElement.dataset.date = date.toISOString();

            dayElement.addEventListener('click', function() {
                if (selectedDateElement) {
                    selectedDateElement.classList.remove('selected');
                }
                selectedDateElement = dayElement;
                dayElement.classList.add('selected');
                generateTransactionCards(date);
            });

            if (isToday) {
                dayElement.innerHTML = `
                    <div class="highlight-wrapper">
                        <div class="highlight day">${daysOfWeek[i]}</div>
                        <div class="highlight date">${date.getDate()}</div>
                    </div>
                `;
            } else {
                dayElement.innerHTML = `
                    <div class="day">${daysOfWeek[i]}</div>
                    <div class="date">${date.getDate()}</div>
                `;
            }

            weekContainer.appendChild(dayElement);

            // Select today by default
            if (isToday) {
                dayElement.click();
            }
        }
    }

    generateTransactionCards(currentWeekStartDate);

    function generateTransactionCards(date) {
        const categories = {
            'Food': ['Chicken Rice', 'Pizza', 'Burger', 'Sushi', 'Pasta'],
            'Transport': ['Taxi Fare', 'Bus Ticket', 'Train Ticket', 'Gas', 'Car Rental'],
            'Groceries': ['Vegetables', 'Fruits', 'Milk', 'Bread', 'Cereal'],
            'Entertainment': ['Movie Ticket', 'Concert Ticket', 'Museum Entry', 'Theme Park', 'Bowling'],
            'Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Gas Bill', 'Phone Bill']
        };

        const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
        const today = new Date();

        if (bankAccounts.length === 0) {
            console.log('No bank accounts found in local storage.');
            return;
        }

        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = ''; // Clear existing transactions

        if (date > today) {
            console.log('No transactions for future dates.');
            return;
        }

        const dateString = date.toLocaleDateString();
        const transactions = [];

        // Generate at least 5 transactions for the selected day
        for (let i = 0; i < 5; i++) {
            const randomCategoryKey = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
            const randomName = categories[randomCategoryKey][Math.floor(Math.random() * categories[randomCategoryKey].length)];
            const randomBank = bankAccounts[Math.floor(Math.random() * bankAccounts.length)].bankName;
            const randomAmount = (Math.random() * (100 - 5) + 5).toFixed(2); // Random amount between 5 and 100
            const cardColor = getBankColor(randomBank);

            const transaction = {
                name: randomName,
                date: dateString,
                category: randomCategoryKey,
                bank: randomBank,
                amount: randomAmount
            };

            transactions.push(transaction);

            const transactionCard = document.createElement('div');
            transactionCard.className = 'transaction-card';
            transactionCard.style.backgroundColor = cardColor.background;
            transactionCard.style.color = cardColor.text;
            transactionCard.innerHTML = `
                <div class="transaction-name">${transaction.name}</div>
                <div class="transaction-date">${transaction.date}</div>
                <div class="transaction-cat">${transaction.category}</div>
                <div class="transaction-content box">
                    <div class="transaction-bank"><b>${transaction.bank}</b></div>
                    <div class="transaction-amount"><b>$${transaction.amount}</b></div>
                </div>
            `;

            transactionList.appendChild(transactionCard);
        }

        localStorage.setItem('todaysTransactions', JSON.stringify(transactions));

        updateTotalAmount();
        generateExpenseChart();
        updateMonthlySpending(transactions);
    }

    function getBankColor(bankName) {
        switch (bankName.toLowerCase()) {
            case 'ocbc':
                return { background: 'var(--dark-blue)', text: 'var(--white)' };
            case 'dbs':
                return { background: 'var(--blue)', text: 'var(--dark-blue)' };
            case 'maybank':
                return { background: 'var(--brown)', text: 'var(--white)' };
            case 'uob':
                return { background: 'var(--olive)', text: 'var(--dark-blue)' };
            case 'standard chartered':
                return { background: 'var(--dark-green)', text: 'var(--white)' };
            case 'posb':
                return { background: 'var(--blue)', text: 'var(--dark-blue)' };
            default:
                return { background: 'var(--white)', text: 'var(--dark-blue)' }; // Default color if bank name doesn't match
        }
    }

    function updateTotalAmount() {
        const transactionList = document.getElementById('transactionList').children;
        let totalAmount = 0;

        for (let transaction of transactionList) {
            const amount = parseFloat(transaction.querySelector('.transaction-amount').textContent.replace('$', ''));
            totalAmount += amount;
        }

        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    function generateExpenseChart() {
        const transactionList = document.getElementById('transactionList').children;
        const categoryTotals = {};

        for (let transaction of transactionList) {
            const category = transaction.querySelector('.transaction-cat').textContent;
            const amount = parseFloat(transaction.querySelector('.transaction-amount').textContent.replace('$', ''));

            if (categoryTotals[category]) {
                categoryTotals[category] += amount;
            } else {
                categoryTotals[category] = amount;
            }
        }

        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);
        const totalAmount = amounts.reduce((a, b) => a + b, 0);

        const ctx = document.getElementById('expenseChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Expenses',
                    data: amounts,
                    backgroundColor: ['#435059', '#7D8274', '#A9A793', '#9BC1C3', '#655C4E'],
                    hoverBackgroundColor: ['#435059', '#7D8274', '#A9A793', '#9BC1C3', '#655C4E']
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
                        text: 'Weekly Expenses'
                    },
                    doughnutlabel: {
                        labels: [
                            {
                                text: 'Total',
                                font: {
                                    size: '20',
                                    weight: 'bold',
                                    color: '#435059' // Change color to dark blue
                                }
                            },
                            {
                                text: `$${totalAmount.toFixed(2)}`,
                                font: {
                                    size: '20',
                                    weight: 'bold',
                                    color: '#435059' // Change color to dark blue
                                }
                            }
                        ]
                    }
                }
            }
        });
    }

    function updateMonthlySpending(transactions) {
        const monthlySpending = JSON.parse(localStorage.getItem('monthlySpending')) || {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
            const amount = parseFloat(transaction.amount);

            if (!monthlySpending[monthYear]) {
                monthlySpending[monthYear] = 0;
            }

            monthlySpending[monthYear] += amount;
        });

        localStorage.setItem('monthlySpending', JSON.stringify(monthlySpending));
    }
});

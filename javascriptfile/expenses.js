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
        const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
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
            allTransactions.push(transaction);

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

        localStorage.setItem('transactions', JSON.stringify(allTransactions));

        updateTotalAmount();
        generateExpenseChart();
        updateMonthlySpending(allTransactions);
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

document.addEventListener("DOMContentLoaded", () => {
    const transactionContainer = document.getElementById("transactions-container");
    const transactionCount = document.getElementById("active-transaction-count");

    function saveTransactions(transactions) {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function loadTransactions() {
        return JSON.parse(localStorage.getItem("transactions") || '[]');
    }

    function renderTransaction(transaction, index) {
        const newTransactionCard = document.createElement("div");
        newTransactionCard.classList.add("transaction-card");
        newTransactionCard.id = `transaction-${index}`;  // Assign a unique ID based on index

        const transactionName = document.createElement("h4");
        transactionName.innerText = transaction.name;

        const transactionAmount = document.createElement("p");
        transactionAmount.innerText = `Transaction Amount: $${transaction.amount.toFixed(2)}`;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-edit", "edit-btn");
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
        `;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-delete", "delete-btn");
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        `;

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        newTransactionCard.appendChild(transactionName);
        newTransactionCard.appendChild(transactionAmount);
        newTransactionCard.appendChild(buttonContainer);
        transactionContainer.appendChild(newTransactionCard);

        editButton.addEventListener("click", () => {
            const editModal = new bootstrap.Modal(document.getElementById("editModal"));
            document.getElementById("edit-transaction-name").value = transaction.name;
            document.getElementById("edit-transaction-amount").value = transaction.amount;
            editModal.show();

            document.getElementById("edit-form").onsubmit = (event) => {
                event.preventDefault();
                const editedName = document.getElementById("edit-transaction-name").value.trim();
                const editedAmount = parseFloat(document.getElementById("edit-transaction-amount").value);

                if (!editedName || isNaN(editedAmount)) {
                    alert("Please enter valid transaction details.");
                    return;
                }

                transaction.name = editedName;
                transaction.amount = editedAmount;
                saveTransactions(loadTransactions().map((t, idx) => idx === index ? transaction : t)); // Update the specific transaction

                // Update the DOM
                document.getElementById(`transaction-${index}`).querySelector('h4').innerText = editedName;
                document.getElementById(`transaction-${index}`).querySelector('p').innerText = `Transaction Amount: $${editedAmount.toFixed(2)}`;
                editModal.hide();
            };
        });

        deleteButton.addEventListener("click", () => {
            if (confirm(`Are you sure you want to delete ${transaction.name}?`)) {
                const updatedTransactions = loadTransactions().filter((_, idx) => idx !== index);
                saveTransactions(updatedTransactions);
                transactionContainer.removeChild(newTransactionCard);
                transactionCount.innerText = updatedTransactions.length;
            }
        });
    }

    const transactionForm = document.getElementById("transaction-form");
    transactionForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("transaction-name").value.trim();
        const amount = parseFloat(document.getElementById("transaction-amount").value);

        if (!name || isNaN(amount)) {
            alert("Please enter valid transaction details.");
            return;
        }

        const transactions = loadTransactions();
        const newTransaction = { name, amount };
        transactions.push(newTransaction);
        saveTransactions(transactions);
        renderTransaction(newTransaction, transactions.length - 1);

        document.getElementById("transaction-name").value = '';
        document.getElementById("transaction-amount").value = '';
        transactionCount.innerText = transactions.length;
    });

    // Initially load transactions and render them
    const transactions = loadTransactions();
    transactions.forEach((transaction, index) => renderTransaction(transaction, index));
    transactionCount.innerText = transactions.length;
});

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('cameraStream');
    const canvas = document.createElement('canvas');
    const snap = document.getElementById('snap');

    // Start camera stream
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                snap.onclick = () => captureImage(stream);
            })
            .catch(function(err) {
                console.error("Error accessing the camera", err);
                alert("Cannot access the camera. Please check device settings.");
            });
    }

    // Capture image from video stream
    function captureImage(stream) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/png');
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        processImage(imageDataURL);
    }

    // Process the captured image
    function processImage(imageDataURL) {
        Tesseract.recognize(
            imageDataURL,
            'eng',
            { logger: m => console.log("Tesseract.js logger:", m) }
        ).then(({ data: { text } }) => {
            fillTransactionForm(text);
        }).catch(error => {
            console.error("Error during OCR processing", error);
        });
    }

    // Fill the transaction form with recognized data
    function fillTransactionForm(text) {
        const nameMatch = text.match(/[a-zA-Z]+/g);
        const amountMatch = text.match(/\$?\d+\.?\d*/);
        if (nameMatch) {
            document.getElementById('transaction-name').value = nameMatch.join(' ');
        }
        if (amountMatch) {
            document.getElementById('transaction-amount').value = amountMatch[0].replace(/[^\d.]/g, '');
        }
    }

    // Modal event listeners
    $('#cameraModal').on('show.bs.modal', startCamera);
    $('#cameraModal').on('hidden.bs.modal', () => {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        // Ensure to re-open the transaction modal
        $('#transactionModal').modal('show');
    });
});

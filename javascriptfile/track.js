document.addEventListener('DOMContentLoaded', function () {
    let transactions = [];

    // Load transactions from localStorage
    function loadTransactions() {
        return JSON.parse(localStorage.getItem("transactions") || '[]');
    }

    // Save transactions to localStorage
    function saveTransactions(transactions) {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // Function to add a transaction
    function addTransaction(name, amount, date) {
        const transaction = { id: Date.now(), name, amount, date: new Date(date).toISOString().split('T')[0] }; // Save date as YYYY-MM-DD format
        transactions.push(transaction);
        saveTransactions(transactions);
        displayTransactions();
    }
    // Function to clear all transactions from localStorage
    function clearLocalStorage() {
        localStorage.removeItem("transactions");
        // Optionally, you can also reset your transactions array in memory
        transactions = [];
        // Refresh the UI to reflect the change
        displayTransactions();
    }

    // Function to display transactions
    // Function to display transactions
function displayTransactions() {
    const container = document.getElementById('transactions-container');
    container.innerHTML = '';

    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    // Sort dates in descending order
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
        const dateSection = document.createElement('div');
        dateSection.className = 'date-section';

        const dateHeader = document.createElement('h3');
        dateHeader.innerText = new Date(date).toLocaleDateString(); // Format and display the date
        dateSection.appendChild(dateHeader);

        // Create a container for transactions under this date
        const transactionsContainer = document.createElement('div');
        transactionsContainer.className = 'transactions-container';

        groupedTransactions[date].forEach(transaction => {
            // Create a card for each transaction
            const card = document.createElement('div');
            card.className = 'card'; // Adjust classes for styling
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            // Transaction details
            const transactionName = document.createElement('h5');
            transactionName.className = 'card-title';
            transactionName.innerText = transaction.name;
            const transactionAmount = document.createElement('p');
            transactionAmount.className = 'card-text';
            transactionAmount.innerText = `Amount: $${transaction.amount}`;

            // Buttons for edit and delete
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group';
            buttonGroup.setAttribute('role', 'group');
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-primary btn-sm edit-btn';
            editButton.innerText = 'Edit';
            editButton.setAttribute('data-id', transaction.id);
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-danger btn-sm delete-btn';
            deleteButton.innerText = 'Delete';
            deleteButton.setAttribute('data-id', transaction.id);

            // Append elements to card body and card
            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);
            cardBody.appendChild(transactionName);
            cardBody.appendChild(transactionAmount);
            cardBody.appendChild(buttonGroup);
            card.appendChild(cardBody);

            // Append card to transactions container
            transactionsContainer.appendChild(card);
        });

        // Append transactions container to date section
        dateSection.appendChild(transactionsContainer);

        // Append date section to main container
        container.appendChild(dateSection);
    });
}

    // Handle form submission
    document.getElementById('transaction-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('transaction-name').value;
        const amount = document.getElementById('transaction-amount').value;
        const date = document.getElementById('transaction-date').value;
        addTransaction(name, amount, date);
        $('#transactionModal').modal('hide');
        document.getElementById('transaction-form').reset(); // Reset form after submission
    });

    // Function to delete a transaction
    function deleteTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactions(transactions);
        displayTransactions();
    }

    // Function to edit a transaction (assuming editing logic)
    function editTransaction(id) {
        // Implement your editing logic here
        // For example, open a modal pre-filled with transaction data for editing
        const transactionToEdit = transactions.find(transaction => transaction.id === id);
        if (transactionToEdit) {
            // Pre-fill modal form fields with transaction data
            document.getElementById('transaction-name').value = transactionToEdit.name;
            document.getElementById('transaction-amount').value = transactionToEdit.amount;
            document.getElementById('transaction-date').value = transactionToEdit.date;

            // Show modal for editing
            $('#transactionModal').modal('show');

            // Save edited transaction on form submit
            document.getElementById('transaction-form').addEventListener('submit', function (event) {
                event.preventDefault();
                const newName = document.getElementById('transaction-name').value;
                const newAmount = document.getElementById('transaction-amount').value;
                const newDate = document.getElementById('transaction-date').value;

                // Update transaction object
                transactionToEdit.name = newName;
                transactionToEdit.amount = newAmount;
                transactionToEdit.date = new Date(newDate).toISOString().split('T')[0];

                saveTransactions(transactions);
                displayTransactions();

                $('#transactionModal').modal('hide');
                document.getElementById('transaction-form').reset(); // Reset form after submission
            });
        }
    }

    // Load and display transactions on page load
    transactions = loadTransactions();
    displayTransactions();

    // Event delegation for delete and edit buttons
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            deleteTransaction(id);
        } else if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            editTransaction(id);
        }
    });
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

// Example: Triggering clearLocalStorage() on button click
document.getElementById('clear-transactions-btn').addEventListener('click', function() {
    clearLocalStorage();
});

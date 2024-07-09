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






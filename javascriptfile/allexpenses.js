document.addEventListener("DOMContentLoaded", () => {
    const goalContainer = document.getElementById("goals-container");
    const goalCount = document.getElementById("active-goal-count");

    function saveGoals(goals) {
        localStorage.setItem("goals", JSON.stringify(goals));
    }

    function loadGoals() {
        const goals = localStorage.getItem("goals");
        return goals ? JSON.parse(goals) : [];
    }

    function renderGoal(goal) {
        const newGoalCard = document.createElement("div");
        newGoalCard.classList.add("goal-card");

        const goalName = document.createElement("h4");
        goalName.innerText = goal.name;

        const goalAmount = document.createElement("p");
        goalAmount.innerText = `Goal Amount: $${goal.amount.toFixed(2)}`;

        const currentAmount = document.createElement("p");
        currentAmount.innerText = `Current Amount: $${goal.current.toFixed(2)}`;

        const progress = (goal.current / goal.amount) * 100;

        const progressBarContainer = document.createElement("div");
        progressBarContainer.classList.add("progress-bar-container");

        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        progressBar.style.width = `${progress}%`;

        const progressPercent = document.createElement("div");
        progressPercent.classList.add("progress-percent");
        progressPercent.innerText = `${progress.toFixed(2)}%`;

        progressBar.appendChild(progressPercent);
        progressBarContainer.appendChild(progressBar);

        const breakdownItemsContainer = document.createElement('div');
        breakdownItemsContainer.classList.add('breakdown-items');
        // Logic to populate breakdownItemsContainer with breakdown item elements (explained later)
        newGoalCard.appendChild(breakdownItemsContainer);

        if (goal.breakdownItems) {
            const breakdownItemsContainer = document.createElement('div');
            breakdownItemsContainer.classList.add('breakdown-items');
          
            goal.breakdownItems.forEach(item => {
              const breakdownItem = document.createElement('div');
              breakdownItem.classList.add('breakdown-item', 'd-flex', 'justify-content-between', 'mb-1');
          
              const itemName = document.createElement('p');
              itemName.innerText = item.name;
          
              const itemCost = document.createElement('p');
              itemCost.innerText = `$${item.cost.toFixed(2)}`;
          
              breakdownItem.appendChild(itemName);
              breakdownItem.appendChild(itemCost);
          
              breakdownItemsContainer.appendChild(breakdownItem);
            });
          
            newGoalCard.appendChild(breakdownItemsContainer);
        }
          

        // Eye Button
        const eyeButton = document.createElement("button");
        eyeButton.classList.add("btn", "btn-eye", "eye-btn");
        eyeButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>
        `;

        // Edit Button
        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-edit", "edit-btn", "ms-2");
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
        `;
        editButton.addEventListener("click", () => {
            // Open the modal for editing
            const editModal = new bootstrap.Modal(document.getElementById("editModal"));
            editModal.show();

            // Populate modal fields with current goal data
            document.getElementById("edit-goal-name").value = goal.name;
            document.getElementById("edit-goal-amount").value = goal.amount.toFixed(2);
            document.getElementById("edit-current-amount").value = goal.current.toFixed(2);

            // Save edited goal on modal submit
            const editForm = document.getElementById("edit-form");
            editForm.addEventListener("submit", (event) => {
                event.preventDefault();

                const editedName = document.getElementById("edit-goal-name").value.trim();
                const editedAmount = parseFloat(document.getElementById("edit-goal-amount").value.trim());
                const editedCurrent = parseFloat(document.getElementById("edit-current-amount").value.trim());

                if (!editedName || isNaN(editedAmount) || isNaN(editedCurrent) || editedCurrent < 0 || editedCurrent > editedAmount) {
                    alert("Please enter valid goal details.");
                    return;
                }

                // Update goal object
                goal.name = editedName;
                goal.amount = editedAmount;
                goal.current = editedCurrent;

                // Update goal card UI
                goalName.innerText = goal.name;
                goalAmount.innerText = `Goal Amount: $${goal.amount.toFixed(2)}`;
                currentAmount.innerText = `Current Amount: $${goal.current.toFixed(2)}`;

                // Update progress bar
                const progress = (goal.current / goal.amount) * 100;
                progressBar.style.width = `${progress}%`;
                progressPercent.innerText = `${progress.toFixed(2)}%`;

                // Update in localStorage
                const goals = loadGoals();
                const updatedGoals = goals.map(g => (g.name === goal.name ? goal : g));
                saveGoals(updatedGoals);

                // Hide the modal
                editModal.hide();
            });
        });

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-delete", "ms-2", "delete-btn");
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        `;
        deleteButton.addEventListener("click", () => {
            // Implement delete functionality here
            newGoalCard.remove(); // Remove the card from UI
            const goals = loadGoals();
            const updatedGoals = goals.filter(g => g.name !== goal.name);
            saveGoals(updatedGoals); // Update local storage
            renderGoals(updatedGoals); // Render updated list
        });

        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("mt-3", "d-flex", "justify-content-end");
        actionsContainer.appendChild(eyeButton);
        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);

        newGoalCard.appendChild(goalName);
        newGoalCard.appendChild(goalAmount);
        newGoalCard.appendChild(currentAmount);
        newGoalCard.appendChild(progressBarContainer);
        newGoalCard.appendChild(actionsContainer);

        goalContainer.appendChild(newGoalCard);
    }

    function renderGoals(goals) {
        goalContainer.innerHTML = "";
        goals.forEach(renderGoal);
        goalCount.innerText = goals.length;
    }

    const goalForm = document.getElementById("goal-form");

    goalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const goalNameInput = document.getElementById("goal-name");
        const goalAmountInput = document.getElementById("goal-amount");
        const currentAmountInput = document.getElementById("current-amount");

        const name = goalNameInput.value.trim();
        const amount = parseFloat(goalAmountInput.value.trim());
        const current = parseFloat(currentAmountInput.value.trim());

        if (!name || isNaN(amount) || isNaN(current) || current < 0 || current > amount) {
            alert("Please enter valid goal details.");
            return;
        }

        const newGoal = {
            name: name,
            amount: amount,
            current: current,
        };

        const goals = loadGoals();
        goals.push(newGoal);
        saveGoals(goals);
        renderGoal(newGoal);

        goalNameInput.value = "";
        goalAmountInput.value = "";
        currentAmountInput.value = "";

        // Dismiss the modal
        const goalModal = new bootstrap.Modal(document.getElementById("goalModal"));
        goalModal.hide();
    });

    // Load goals on page load
    renderGoals(loadGoals());
});
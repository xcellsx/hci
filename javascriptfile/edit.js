document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const goalData = JSON.parse(decodeURIComponent(urlParams.get('goal')));

    if (goalData) {
        // Display goal details
        document.getElementById('goal-name').textContent = goalData.name;
        document.getElementById('target-amount').textContent = goalData.targetAmount.toFixed(2);
        document.getElementById('current-amount').textContent = goalData.currentAmount.toFixed(2);

        // Calculate and display progress
        updateProgress(goalData.currentAmount, goalData.targetAmount);

        // Set the ending date input
        const endingDateInput = document.getElementById('ending-date');
        endingDateInput.value = goalData.endDate; // Set goal ending date

        // Event listener to update dates and generate breakdown
        document.getElementById('update-dates').addEventListener('click', function () {
            const newEndingDate = endingDateInput.value;

            // Update the goal dates in localStorage
            const goals = JSON.parse(localStorage.getItem('goals')) || [];
            const updatedGoals = goals.map(goal => {
                if (goal.name === goalData.name) {
                    return { ...goal, endDate: newEndingDate };
                }
                return goal;
            });
            localStorage.setItem('goals', JSON.stringify(updatedGoals));

            alert('Dates updated successfully!');
            generateBreakdown(goalData.currentAmount, goalData.targetAmount, newEndingDate);
        });

        // Initial breakdown generation
        generateBreakdown(goalData.currentAmount, goalData.targetAmount, goalData.endDate);

        // Event listeners for radio buttons
        document.querySelectorAll('input[name="view"]').forEach(radio => {
            radio.addEventListener('change', function () {
                generateBreakdown(goalData.currentAmount, goalData.targetAmount, endingDateInput.value);
            });
        });

        // Event listener for delete confirmation
        document.getElementById('confirm-delete').addEventListener('click', function () {
            deleteGoal(goalData.name);
        });
    }

    function updateProgress(currentAmount, targetAmount) {
        const progress = (currentAmount / targetAmount) * 100;
        document.getElementById('progress-percentage').textContent = `${progress.toFixed(2)}%`;
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    function generateBreakdown(currentAmount, targetAmount, endingDate) {
        const breakdownTable = document.getElementById('breakdown-table');
        breakdownTable.innerHTML = ''; // Clear existing rows

        const endingDateObj = new Date(endingDate);
        const today = new Date();
        const timeDiff = endingDateObj.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let periods, periodLabel;
        const selectedView = document.querySelector('input[name="view"]:checked').value;

        if (selectedView === 'weekly') {
            periods = Math.ceil(daysDiff / 7);
            periodLabel = 'Week';
        } else if (selectedView === 'monthly') {
            periods = Math.ceil(daysDiff / 30);
            periodLabel = 'Month';
        } else if (selectedView === 'yearly') {
            periods = Math.ceil(daysDiff / 365);
            periodLabel = 'Year';
        }

        const amountPerPeriod = (targetAmount - currentAmount) / periods;

        for (let i = 1; i <= periods; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="saved-checkbox" data-period="${i}" data-amount="${amountPerPeriod.toFixed(2)}"></td>
                <td>${periodLabel} ${i}</td>
                <td>$${amountPerPeriod.toFixed(2)}</td>
            `;
            breakdownTable.appendChild(row);
        }

        // Add event listeners to checkboxes
        document.querySelectorAll('.saved-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const period = this.getAttribute('data-period');
                const amount = parseFloat(this.getAttribute('data-amount'));
                const isChecked = this.checked;
                updateSavedStatus(goalData.name, period, isChecked, amount);
            });
        });
    }

    function updateSavedStatus(goalName, period, isChecked, amount) {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        let currentAmount;

        const updatedGoals = goals.map(goal => {
            if (goal.name === goalName) {
                if (!goal.savedPeriods) {
                    goal.savedPeriods = {};
                }
                goal.savedPeriods[period] = isChecked;

                if (isChecked) {
                    goal.currentAmount += amount;
                } else {
                    goal.currentAmount -= amount;
                }
                currentAmount = goal.currentAmount;
            }
            return goal;
        });
        localStorage.setItem('goals', JSON.stringify(updatedGoals));

        // Update current amount and progress
        document.getElementById('current-amount').textContent = currentAmount.toFixed(2);
        const targetAmount = parseFloat(document.getElementById('target-amount').textContent);
        updateProgress(currentAmount, targetAmount);
    }

    function deleteGoal(goalName) {
        let goals = JSON.parse(localStorage.getItem('goals')) || [];
        goals = goals.filter(goal => goal.name !== goalName);
        localStorage.setItem('goals', JSON.stringify(goals));
        window.location.href = 'goals.html';
    }
});

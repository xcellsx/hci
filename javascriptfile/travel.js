document.addEventListener('DOMContentLoaded', function () {
    const addGoalButton = document.getElementById('add-goal');
    const goalModalLabel = document.getElementById('goalModalLabel');
    const goalForm = document.getElementById('goal-form');
    const goalModal = new bootstrap.Modal(document.getElementById('goalModal'));
    const goalCountElement = document.getElementById('active-goal-count');
    const goalsContainer = document.getElementById('goals-container');
    let goalCount = 0;

    function loadGoals() {
        const goals = localStorage.getItem("goals");
        return goals ? JSON.parse(goals) : [];
    }

    function createGoalCard(goalName, goalAmount, currentAmount) {
        const progressPercent = (currentAmount / goalAmount) * 100;

        const goalCard = document.createElement('div');
        goalCard.className = 'card me-3 mb-3'; 
        goalCard.style.textAlign = 'center';
        goalCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${goalName}</h5>
                <p class="card-text">Goal Amount: $${goalAmount.toFixed(2)}</p>
                <p class="card-text">Current Amount: $${currentAmount.toFixed(2)}</p>
                <p class="card-text">Progress: ${Math.round(progressPercent)}%</p>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${progressPercent}%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPercent}"></div>
                </div>
                <div class="btns">
                    <a href = "edit-goals.html"><button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal" data-goal-name="${goalName}" data-goal-amount="${goalAmount}" data-current-amount="${currentAmount}">View</button></a>
                    <button class="btn btn-secondary btn-sm ms-1" data-bs-toggle="modal" data-bs-target="#editModal" data-goal-name="${goalName}" data-goal-amount="${goalAmount}" data-current-amount="${currentAmount}">Edit</button>
                </div>
            </div>
        `;
        goalsContainer.appendChild(goalCard);
    }

    function saveGoals() {
        const goalCards = document.querySelectorAll('#goals-container .card');
        const goals = Array.from(goalCards).map(card => {
            return {
                name: card.querySelector('.card-title').textContent,
                amount: parseFloat(card.querySelector('.card-text').textContent.split('$')[1]),
                currentAmount: parseFloat(card.querySelector('.card-text:nth-of-type(2)').textContent.split('$')[1])
            };
        });
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    addGoalButton.addEventListener('click', function () {
        goalModalLabel.textContent = 'Add New Goal';
        goalForm.reset();
    });

    goalForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const goalName = document.getElementById('goal-name').value;
        const goalAmount = parseFloat(document.getElementById('goal-amount').value);
        const currentAmount = parseFloat(document.getElementById('current-amount').value);

        if (isNaN(goalAmount) || isNaN(currentAmount) || goalAmount <= 0) {
            alert('Please enter valid amounts.');
            return;
        }

        createGoalCard(goalName, goalAmount, currentAmount);

        goalCount++;
        goalCountElement.textContent = goalCount;

        saveGoals();

        goalForm.reset();
        goalModal.hide();
    });

    document.getElementById('editModal').addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const goalName = button.getAttribute('data-goal-name');
        const goalAmount = button.getAttribute('data-goal-amount');
        const currentAmount = button.getAttribute('data-current-amount');

        document.getElementById('edit-goal-name').value = goalName;
        document.getElementById('edit-goal-amount').value = goalAmount;
        document.getElementById('edit-current-amount').value = currentAmount;
    });

    document.getElementById('edit-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const editGoalName = document.getElementById('edit-goal-name').value;
        const editGoalAmount = parseFloat(document.getElementById('edit-goal-amount').value);
        const editCurrentAmount = parseFloat(document.getElementById('edit-current-amount').value);

        if (isNaN(editGoalAmount) || isNaN(editCurrentAmount) || editGoalAmount <= 0) {
            alert('Please enter valid amounts.');
            return;
        }

        const goalCards = document.querySelectorAll('#goals-container .card');
        goalCards.forEach(card => {
            const cardGoalName = card.querySelector('.card-title').textContent;
            if (cardGoalName === editGoalName) {
                card.querySelector('.card-text:nth-of-type(1)').textContent = `Goal Amount: $${editGoalAmount.toFixed(2)}`;
                card.querySelector('.card-text:nth-of-type(2)').textContent = `Current Amount: $${editCurrentAmount.toFixed(2)}`;
                const editProgressPercent = (editCurrentAmount / editGoalAmount) * 100;
                card.querySelector('.card-text:nth-of-type(3)').textContent = `Progress: ${Math.round(editProgressPercent)}%`;
                const progressBar = card.querySelector('.progress-bar');
                progressBar.style.width = `${editProgressPercent}%`;
                progressBar.setAttribute('aria-valuenow');
                progressBar.textContent = `${Math.round(editProgressPercent)}%`;
            }
        });

        saveGoals();

        document.getElementById('edit-form').reset();
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.hide();
    });

    document.getElementById('viewModal').addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const goalName = button.getAttribute('data-goal-name');
        const goalAmount = button.getAttribute('data-goal-amount');
        const currentAmount = button.getAttribute('data-current-amount');

        document.getElementById('view-goal-name').textContent = goalName;
        document.getElementById('view-goal-amount').textContent = `$${goalAmount.toFixed(2)}`;
        document.getElementById('view-current-amount').textContent = `$${currentAmount.toFixed(2)}`;
        document.getElementById('view-progress').textContent = `Progress: ${Math.round((currentAmount / goalAmount) * 100)}%`;
    });

    // Load goals when the page is fully loaded
    const savedGoals = loadGoals();
    savedGoals.forEach(goal => {
        createGoalCard(goal.name, goal.amount, goal.currentAmount);
        goalCount++;
    });
    goalCountElement.textContent = goalCount;
});

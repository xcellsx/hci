document.addEventListener('DOMContentLoaded', function () {
    generateCategoryTabs();
    loadGoals();

    document.getElementById('goal-form').addEventListener('submit', function (event) {
        event.preventDefault();
        addGoal();
    });

    function generateCategoryTabs() {
        const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
        const categories = new Set(selectedCategories);

        const catTabsContainer = document.querySelector('.cat-tabs');
        catTabsContainer.innerHTML = ''; // Clear existing tabs

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'btn btn-2 m-1 category';
            button.textContent = category;
            button.addEventListener('click', function () {
                toggleCategory(button);
                filterGoals();
            });
            catTabsContainer.appendChild(button);
        });

        // Populate the category dropdown in the modal
        const categoryDropdown = document.getElementById('goal-category');
        categoryDropdown.innerHTML = ''; // Clear existing options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryDropdown.appendChild(option);
        });
    }

    function addGoal() {
        const goalName = document.getElementById('goal-name').value;
        const goalEndDate = document.getElementById('goal-end-date').value;
        const goalTarget = parseFloat(document.getElementById('goal-target').value);
        const goalCurrentAmount = parseFloat(document.getElementById('goal-current-amount').value);
        const goalCategory = document.getElementById('goal-category').value;

        const newGoal = {
            name: goalName,
            endDate: goalEndDate, // Ensure endDate is saved here
            targetAmount: goalTarget,
            currentAmount: goalCurrentAmount,
            category: goalCategory
        };

        // Save the new goal to localStorage
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        goals.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goals));

        // Add the new goal to the appropriate goals section
        const isComplete = newGoal.currentAmount >= newGoal.targetAmount;
        displayGoal(newGoal, isComplete);

        // Update charts and counters
        updateGoalCountersAndCharts();

        // Reset the form and close the modal
        document.getElementById('goal-form').reset();
        var goalModal = bootstrap.Modal.getInstance(document.getElementById('goalModal'));
        goalModal.hide();
    }

    function loadGoals() {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        displayGoals(goals);
        // Update charts and counters
        updateGoalCountersAndCharts();
    }

    function displayGoals(goals) {
        const activeGoalsContainer = document.getElementById('active-goals');
        const completedGoalsContainer = document.getElementById('completed-goals');
        activeGoalsContainer.innerHTML = '';
        completedGoalsContainer.innerHTML = '';

        goals.forEach(goal => {
            const isComplete = goal.currentAmount >= goal.targetAmount;
            displayGoal(goal, isComplete);
        });
    }

    function displayGoal(goal, isComplete) {
        const goalCardHtml = `
            <div class="goalcard" onclick="location.href='edit.html?goal=${encodeURIComponent(JSON.stringify(goal))}'">
                <div class="grp">
                    <p>${goal.name}</p>
                    <p><b>${((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)}%</b></p>
                </div>
                <div class="grp">
                    <p>${goal.endDate}</p>
                    <p><b>$${goal.currentAmount.toFixed(2)}</b></p>
                </div>
                <div class="grp">
                    <p>${goal.category}</p>
                    <p><b>$${goal.targetAmount.toFixed(2)}</b></p>
                </div>
            </div>
        `;

        if (isComplete) {
            document.getElementById('completed-goals').insertAdjacentHTML('beforeend', goalCardHtml);
        } else {
            document.getElementById('active-goals').insertAdjacentHTML('beforeend', goalCardHtml);
        }
    }

    function toggleCategory(element) {
        element.classList.toggle("selected");
        updateCategoryStyle(element);
    }

    function updateCategoryStyle(element) {
        if (element.classList.contains("selected")) {
            element.style.backgroundColor = "var(--dark-blue)";
            element.style.color = "white";
        } else {
            element.style.backgroundColor = "";
            element.style.color = "";
        }
    }

    function saveCategories() {
        const selectedCategories = document.querySelectorAll(".category.selected");
        const categories = Array.from(selectedCategories).map(category => category.textContent.trim());
        localStorage.setItem('selectedCategories', JSON.stringify(categories));
    }

    function goToNextPage() {
        saveCategories();
        window.location.href = 'loading.html'; // Replace 'loading.html' with the actual URL of your loading page
    }

    document.getElementById('nextButton').addEventListener('click', goToNextPage);

    window.toggleCategory = toggleCategory;

    function loadSelectedCategories() {
        const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
        const categoryElements = document.querySelectorAll(".category");
        categoryElements.forEach(category => {
            if (selectedCategories.includes(category.textContent.trim())) {
                category.classList.add("selected");
                updateCategoryStyle(category);
            }
        });
    }

    loadSelectedCategories();

    function updateGoalCountersAndCharts() {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
        const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);

        const activeGoalsCount = activeGoals.length;
        const completedGoalsCount = completedGoals.length;

        const activeGoalCategories = activeGoals.reduce((acc, goal) => {
            acc[goal.category] = (acc[goal.category] || 0) + 1;
            return acc;
        }, {});

        const completedGoalCategories = completedGoals.reduce((acc, goal) => {
            acc[goal.category] = (acc[goal.category] || 0) + 1;
            return acc;
        }, {});

        renderPieChart('activeGoalsChart', activeGoalCategories, `Active Goals: ${activeGoalsCount}`);
        renderPieChart('completedGoalsChart', completedGoalCategories, `Completed Goals: ${completedGoalsCount}`);
    }

    function renderPieChart(canvasId, data, title) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: ['#435059', '#7D8274', '#A9A793', '#9BC1C3', '#655C4E'],
                    hoverBackgroundColor: ['#435059', '#7D8274', '#A9A793', '#9BC1C3', '#655C4E']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false // Hide the legend
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    }

    function filterGoals() {
        const selectedCategories = Array.from(document.querySelectorAll(".category.selected")).map(category => category.textContent.trim());
        const goals = JSON.parse(localStorage.getItem('goals')) || [];

        const filteredGoals = selectedCategories.length > 0 ? goals.filter(goal => selectedCategories.includes(goal.category)) : goals;

        displayGoals(filteredGoals);
        updateGoalCountersAndCharts(); // Ensure charts and counters are updated based on filtered goals
    }
});

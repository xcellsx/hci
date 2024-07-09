document.addEventListener('DOMContentLoaded', () => {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    let currentAmount = 0; // Initialize currentAmount globally
    let selectedView = 'weekly'; // Default view
    let startDate, endDate; // Declare startDate and endDate variables

    if (goals.length > 0) {
        const goal = goals[0]; // Assuming you want to edit the first goal. Adjust as necessary.

        const goalName = goal.name;
        const targetAmount = goal.amount;
        currentAmount = goal.current || 0; // Initialize currentAmount from goal or 0 if not set
        startDate = goal.startDate || new Date().toISOString().split('T')[0];
        endDate = goal.endDate || new Date().toISOString().split('T')[0];

        document.getElementById('goal-name').textContent = goalName;
        document.getElementById('target-amount').textContent = `$${targetAmount.toFixed(2)}`;
        document.getElementById('current-amount').textContent = `$${currentAmount.toFixed(2)}`;
        document.getElementById('start-date').value = startDate;
        document.getElementById('end-date').value = endDate;

        function calculateBreakdown(start, end, view) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            const breakdown = [];
            let diffInPeriods = 0;

            if (view === 'weekly') {
                diffInPeriods = calculateWeeks(startDate, endDate);
            } else if (view === 'monthly') {
                diffInPeriods = calculateMonths(startDate, endDate);
            } else if (view === 'yearly') {
                diffInPeriods = calculateYears(startDate, endDate);
            }

            let current = new Date(startDate);
            const remainingAmount = targetAmount - currentAmount;

            if (view === 'weekly') {
                const weeklyAmount = remainingAmount / (diffInPeriods + 1);

                while (current <= endDate) {
                    const weekStartDate = new Date(current);
                    const weekEndDate = new Date(current);
                    weekEndDate.setDate(weekEndDate.getDate() + 6);

                    // Format the year in 'yy' format
                    const weekStartYear = weekStartDate.getFullYear().toString().slice(-2);
                    const weekEndYear = weekEndDate.getFullYear().toString().slice(-2);

                    const period = `${weekStartDate.getDate()}/${weekStartDate.getMonth() + 1}/${weekStartYear} - ${weekEndDate.getDate()}/${weekEndDate.getMonth() + 1}/${weekEndYear}`;
                    breakdown.push({ period, amount: weeklyAmount.toFixed(2) });
                    current.setDate(current.getDate() + 7);
                }
            } else if (view === 'monthly') {
                const monthlyAmount = remainingAmount / (diffInPeriods + 1);

                while (current <= endDate) {
                    const month = current.toLocaleString('default', { month: 'long' });
                    const year = current.getFullYear();
                    const period = `${month} ${year}`;
                    breakdown.push({ period, amount: monthlyAmount.toFixed(2) });
                    current.setMonth(current.getMonth() + 1);
                }
            } else if (view === 'yearly') {
                const yearlyAmount = remainingAmount / (diffInPeriods + 1);

                while (current <= endDate) {
                    const year = current.getFullYear();
                    const period = `${year}`;
                    breakdown.push({ period, amount: yearlyAmount.toFixed(2) });
                    current.setFullYear(current.getFullYear() + 1);
                }
            }

            return breakdown;
        }

        function renderBreakdown(breakdown) {
            const breakdownTable = document.getElementById('breakdown-table');
            breakdownTable.innerHTML = '';
            breakdown.forEach(item => {
                const row = document.createElement('tr');

                // Checkbox column
                const cellCheckbox = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.checked || false; // Set checked state from item in breakdown
                checkbox.addEventListener('change', function() {
                    const amountToAdd = parseFloat(item.amount);
                    if (this.checked) {
                        currentAmount += amountToAdd;
                        item.checked = true; // Update item state in breakdown
                    } else {
                        currentAmount -= amountToAdd;
                        item.checked = false; // Update item state in breakdown
                    }
                    document.getElementById('current-amount').textContent = `$${currentAmount.toFixed(2)}`;
                    goal.current = currentAmount; // Update current amount in the goal object
                    goal.breakdown = breakdown; // Update breakdown in the goal object
                    localStorage.setItem('goals', JSON.stringify(goals)); // Update local storage
                });
                cellCheckbox.appendChild(checkbox);
                row.appendChild(cellCheckbox);

                // Period column
                const cellPeriod = document.createElement('td');
                cellPeriod.textContent = item.period;
                row.appendChild(cellPeriod);

                // Amount column
                const cellAmount = document.createElement('td');
                cellAmount.textContent = `$${item.amount}`;
                row.appendChild(cellAmount);

                breakdownTable.appendChild(row);
            });
        }

        function updateTable(view) {
            selectedView = view;
            const breakdown = calculateBreakdown(startDate, endDate, selectedView);
            renderBreakdown(breakdown);
        }

        function calculateWeeks(start, end) {
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.ceil(diffDays / 7);
        }

        function calculateMonths(start, end) {
            return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        }

        function calculateYears(start, end) {
            return end.getFullYear() - start.getFullYear();
        }

        // Initial rendering
        let breakdown = calculateBreakdown(startDate, endDate, selectedView);
        renderBreakdown(breakdown);

        // Event listeners for view selection
        document.getElementById('weekly').addEventListener('change', () => updateTable('weekly'));
        document.getElementById('monthly').addEventListener('change', () => updateTable('monthly'));
        document.getElementById('yearly').addEventListener('change', () => updateTable('yearly'));

        // Update dates button handler
        document.getElementById('update-dates').addEventListener('click', () => {
            const newStartDate = document.getElementById('start-date').value;
            const newEndDate = document.getElementById('end-date').value;

            startDate = newStartDate; // Update startDate with new value
            endDate = newEndDate; // Update endDate with new value

            breakdown = calculateBreakdown(startDate, endDate, selectedView);
            renderBreakdown(breakdown);

            // Update the goal's dates and breakdown in local storage
            goal.startDate = newStartDate;
            goal.endDate = newEndDate;
            goal.breakdown = breakdown;
            localStorage.setItem('goals', JSON.stringify(goals));
        });
    } else {
        alert('No goals found in local storage.');
    }
});

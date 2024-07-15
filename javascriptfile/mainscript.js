let currentDate = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const categoryIcons = {
    "Food": "images/cookie.svg",
    "Birthday": "images/gift.svg",
    "Shopping": "images/cart.svg",
    "Transportation": "images/car-front.svg",
    "Healthcare": "images/heart-pulse.svg"
};

document.addEventListener("DOMContentLoaded", function() {
    renderCalendar();
    calculateTotalSpentForJuly(); // Calculate total spent for July
    generateMonthlyCategoryChart(); // Generate monthly category chart
});

function renderCalendar() {
    const monthYear = document.getElementById('monthYear');
    const days = document.getElementById('days');

    monthYear.innerHTML = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    days.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        days.innerHTML += '<div></div>';
    }

    const today = new Date(); // Get today's date

    for (let i = 1; i <= lastDate; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        dayDiv.onclick = () => showCategories(i);

        // Disable future dates
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        if (selectedDate > today) {
            dayDiv.classList.add('disabled');
            dayDiv.onclick = null; // Disable click
        } else if (currentDate.getDate() === i && currentDate.getMonth() === currentDate.getMonth()) {
            dayDiv.classList.add('current-date');
        }

        days.appendChild(dayDiv);
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    calculateTotalSpentForJuly(); // Recalculate total spent for July
    generateMonthlyCategoryChart(); // Recalculate the chart
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    calculateTotalSpentForJuly(); // Recalculate total spent for July
    generateMonthlyCategoryChart(); // Recalculate the chart
}

let selectedDay = null; // Add a variable to store the selected day

function showCategories(day) {
    selectedDay = day; 
    const expenditureContent = document.getElementById('expenditureContent');
    const key = `expenditureData_${currentDate.getFullYear()}_${currentDate.getMonth()}_${day}`;
    
    const today = new Date();
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (selectedDate > today) {
        return;
    }

    if (!localStorage.getItem(key)) {
        const selectedCategories = Object.keys(categoryIcons)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const expenditureData = [];

        expenditureContent.innerHTML = '';
        const dateHeader = document.createElement('h5');
        dateHeader.textContent = `Expenses for ${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`;
        expenditureContent.appendChild(dateHeader);

        selectedCategories.forEach(category => {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';

            const categoryIcon = document.createElement('img');
            categoryIcon.src = categoryIcons[category]; // Use the mapping for icons
            categoryIcon.alt = category;

            const amount = (Math.random() * 50).toFixed(2);
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.textContent = `${category}: $${amount}`;

            categoryContainer.appendChild(categoryIcon);
            categoryContainer.appendChild(categoryDiv);
            expenditureContent.appendChild(categoryContainer);

            expenditureData.push({ name: category, amount, icon: categoryIcons[category] });
        });

        localStorage.setItem(key, JSON.stringify(expenditureData));
    } else {
        loadExpenditureData(key, true);
    }
}

function loadExpenditureData(key = null, regenerateIcons = false) {
    const expenditureContent = document.getElementById('expenditureContent');

    if (selectedDay === null) {
        expenditureContent.innerHTML = '';
        return;
    }

    if (!key) {
        key = `expenditureData_${currentDate.getFullYear()}_${currentDate.getMonth()}_${selectedDay}`;
    }

    const expenditureData = JSON.parse(localStorage.getItem(key));
    expenditureContent.innerHTML = '';

    const dateHeader = document.createElement('h5');
    dateHeader.textContent = `Expenses for ${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`;
    expenditureContent.appendChild(dateHeader);

    if (expenditureData) {
        expenditureData.forEach(entry => {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';

            const categoryIcon = document.createElement('img');
            categoryIcon.src = entry.icon; // Use stored icon
            categoryIcon.alt = entry.name;

            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.textContent = `${entry.name}: $${entry.amount}`;

            categoryContainer.appendChild(categoryIcon);
            categoryContainer.appendChild(categoryDiv);
            expenditureContent.appendChild(categoryContainer);
        });
    } else {
        const noDataMessage = document.createElement('div');
        noDataMessage.textContent = 'No expenditure data available for this date.';
        expenditureContent.appendChild(noDataMessage);
    }
}

function generateRandomExpenditureForJuly() {
    const daysInJuly = 31; // Number of days in July
    const randomExpenditures = [];
    
    for (let day = 1; day <= daysInJuly; day++) {
        // Generate random expenditure data for each day
        const selectedCategories = Object.keys(categoryIcons)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const expenditureData = selectedCategories.map(category => ({
            name: category,
            amount: (Math.random() * 50).toFixed(2),
            icon: categoryIcons[category]
        }));
        
        randomExpenditures.push(expenditureData);
        
        // Store the generated data for July in localStorage
        const key = `expenditureData_${currentDate.getFullYear()}_6_${day}`; // July is month 6 (0-based index)
        localStorage.setItem(key, JSON.stringify(expenditureData));
    }
    
    return randomExpenditures;
}

function calculateTotalSpentForJuly() {
    const totalSpentElement = document.getElementById('totalSpent');
    let total = 0;

    // Generate random expenditures for July
    generateRandomExpenditureForJuly();

    // Sum up the total expenditures
    for (let day = 1; day <= 31; day++) {
        const key = `expenditureData_${currentDate.getFullYear()}_6_${day}`;
        const expenditureData = JSON.parse(localStorage.getItem(key));

        if (expenditureData) {
            expenditureData.forEach(entry => {
                total += parseFloat(entry.amount);
            });
        }
    }

    totalSpentElement.textContent = `Total Spent in July: $${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", function() {
    renderCalendar();
    calculateTotalSpentForJuly(); // Calculate total spent for July
    generateMonthlyCategoryChart(); // Generate monthly category chart
});

document.addEventListener("DOMContentLoaded", function() {
    renderCalendar();
    calculateTotalSpentForJuly(); // Calculate total spent for July
    generateMonthlyCategoryChart(); // Generate monthly category chart
});

function generateMonthlyCategoryChart() {
    const categories = Object.keys(categoryIcons);
    const categoryData = {};

    // Initialize category data
    categories.forEach(category => {
        categoryData[category] = 0;
    });

    // Aggregate total amounts for each category
    for (let day = 1; day <= 31; day++) {
        const key = `expenditureData_${currentDate.getFullYear()}_6_${day}`;
        const expenditureData = JSON.parse(localStorage.getItem(key));

        if (expenditureData) {
            expenditureData.forEach(entry => {
                categoryData[entry.name] += parseFloat(entry.amount);
            });
        }
    }

    // Colors for each category
    const backgroundColors = [
        'rgba(0, 102, 0, 1)',  // Red
        'rgba(28, 42, 2, 1)',  // Blue
        'rgba(0, 102, 0, 0.75)',  // Yellow
        'rgba(0, 102, 0, 0.5)',  // Green
        'rgba(28, 42, 2, 0.5)',  // Blue
    ];
    const borderColors = [
        'rgba(0, 102, 0, 1)',  // Red
        'rgba(28, 42, 2, 1)',  // Blue
        'rgba(0, 102, 0, 0.75)',  // Yellow
        'rgba(0, 102, 0, 0.5)',  // Green
        'rgba(28, 42, 2, 0.5)',  // Blue
    ];

    // Create the chart
    const ctx = document.getElementById('monthlyExpenditureChart').getContext('2d');
    const data = {
        labels: categories,
        datasets: [{
            label: 'Total Expenditure in July',
            data: categories.map(category => categoryData[category]),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'doughnut', // Change to 'doughnut'
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += '$' + context.parsed.toFixed(2);
                            }
                            return label;
                        }
                    }
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.forEach(data => {
                            sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },
                    color: '#E9EBED', // Change this to the desired label color
                    labels: {
                        title: {
                            font: {
                                size: '14'
                            }
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}


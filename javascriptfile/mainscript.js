        let currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
        document.addEventListener("DOMContentLoaded", function() {
            renderCalendar();
            loadExpenditureData();
            calculateTotalSpent(); // Call to calculate total spent
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
            calculateTotalSpent(); // Recalculate total spent
        }
    
        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
            calculateTotalSpent(); // Recalculate total spent
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




        function calculateTotalSpent() {
            const totalSpentElement = document.getElementById('totalSpent');
            let total = 0;
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const key = `expenditureData_${currentDate.getFullYear()}_${currentDate.getMonth()}_${day}`;
                const expenditureData = JSON.parse(localStorage.getItem(key));

                if (expenditureData) {
                    expenditureData.forEach(entry => {
                        total += parseFloat(entry.amount);
                    });
                }
            }

            totalSpentElement.textContent = `Total Spent This Month: $${total.toFixed(2)}`;
        }

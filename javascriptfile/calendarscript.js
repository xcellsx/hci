document.addEventListener("DOMContentLoaded", function() {
  const daysContainer = document.querySelector(".days");
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let currentDate = new Date();

  // Event listeners for daily and monthly view toggles
  document.getElementById('daily').addEventListener('change', function() {
      if (this.checked) {
          // Redirect to the daily view (current page)
          window.location.href = 'mainpage.html'; // Replace with the current page URL
      }
  });

  document.getElementById('monthly').addEventListener('change', function() {
      if (this.checked) {
          // Redirect to the monthly view (calendar page)
          window.location.href = 'calendar.html'; // Replace with the calendar page URL
      }
  });

  renderCalendar();

  daysContainer.addEventListener("click", function(event) {
      if (event.target.nodeName === "DIV" && event.target.textContent.trim() !== '') {
          const allDays = daysContainer.querySelectorAll("div");
          allDays.forEach(day => day.classList.remove("selected-date"));

          event.target.classList.add("selected-date");

          const day = event.target.textContent.trim();
          const month = currentDate.getMonth() + 1; // JavaScript months are 0-11
          const year = currentDate.getFullYear();
          const formattedDate = `${day.padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

          const expenditureData = getExpenditureData(formattedDate);

          const expenditureContent = document.getElementById("expenditureContent");
          expenditureContent.innerHTML = `
              <p>Date: ${formattedDate}</p>
              <p>Total Spent: $${expenditureData.reduce((total, item) => total + item.amount, 0)}</p>
              <ul>
                  ${expenditureData.map(item => `<li>${item.description}: $${item.amount}</li>`).join('')}
              </ul>
          `;

          const expenditureSection = document.getElementById("expenditureData");
          expenditureSection.classList.add("show");
      }
  });

  function renderCalendar() {
      const monthYear = document.getElementById('monthYear');
      const days = document.getElementById('days');
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      monthYear.innerHTML = `${monthNames[currentMonth]} ${currentYear}`;

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

      days.innerHTML = '';

      for (let i = 0; i < firstDay; i++) {
          days.innerHTML += '<div></div>';
      }

      for (let i = 1; i <= lastDate; i++) {
          const dayDiv = document.createElement('div');
          dayDiv.textContent = i;
          if (currentDate.getDate() === i && currentDate.getMonth() === currentMonth) {
              dayDiv.classList.add('current-date');
          }

          const formattedDate = `${i.toString().padStart(2, '0')}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentYear}`;
          const expenditureData = getExpenditureData(formattedDate);
          const totalSpent = expenditureData.reduce((total, item) => total + item.amount, 0);

          days.appendChild(dayDiv);
      }
  }

  function getExpenditureData(date) {
      const dummyData = {
          "01-07-2024": [
              { description: "Expense 1", amount: 20 },
              { description: "Expense 2", amount: 30 }
          ],
          "02-07-2024": [
              { description: "Expense 3", amount: 50 },
              { description: "Expense 4", amount: 50 }
          ],
          "03-07-2024": [
              { description: "Expense 3", amount: 50 },
              { description: "Expense 4", amount: 50 }
          ],
          // Add more data as needed
      };

      return dummyData[date] || [];
  }

  window.prevMonth = function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
  };

  window.nextMonth = function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
  };
});

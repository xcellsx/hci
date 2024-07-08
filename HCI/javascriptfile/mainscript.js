<<<<<<< HEAD
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
  
  document.getElementById('date').addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    const circles = document.querySelectorAll('.circle');
  
    // Example logic to update circle content based on the selected date
    circles.forEach((circle, index) => {
      // Here you can define how the content of circles should change based on the date
      // For example, just displaying the day of the month plus index for simplicity
      circle.textContent = selectedDate.getDate() + index;
    });
  });

  function toggleSummary(element) {
    const summaries = document.querySelectorAll('.summary');
    summaries.forEach(summary => summary.style.display = 'none');

    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => circle.classList.remove('active'));

    const summary = element.nextElementSibling;
    if (summary && summary.classList.contains('summary')) {
        element.classList.add('active');
        summary.style.display = 'block';
    }
=======
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
  
  document.getElementById('date').addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    const circles = document.querySelectorAll('.circle');
  
    // Example logic to update circle content based on the selected date
    circles.forEach((circle, index) => {
      // Here you can define how the content of circles should change based on the date
      // For example, just displaying the day of the month plus index for simplicity
      circle.textContent = selectedDate.getDate() + index;
    });
  });

  function toggleSummary(element) {
    const summaries = document.querySelectorAll('.summary');
    summaries.forEach(summary => summary.style.display = 'none');

    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => circle.classList.remove('active'));

    const summary = element.nextElementSibling;
    if (summary && summary.classList.contains('summary')) {
        element.classList.add('active');
        summary.style.display = 'block';
    }
>>>>>>> 9fe87bbe50efcaf502c9ff4087a9b21ddb5a4a22
}
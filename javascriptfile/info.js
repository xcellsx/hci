function saveAbout() {
    const occupation = document.getElementById('occupation').value;
    const income = document.getElementById('income').value;
    const expenses = document.getElementById('expenses').value;
    const budget = document.getElementById('budget').value;

    const aboutData = {
        occupation: occupation,
        income: income,
        expenses: expenses,
        budget: budget
    };

    localStorage.setItem('aboutData', JSON.stringify(aboutData));
    alert("Your information has been saved!");
}

function loadAbout() {
    const savedData = JSON.parse(localStorage.getItem('aboutData'));

    if (savedData) {
        document.getElementById('occupation').value = savedData.occupation || '';
        document.getElementById('income').value = savedData.income || '';
        document.getElementById('expenses').value = savedData.expenses || '';
        document.getElementById('budget').value = savedData.budget || '';
    }
}

// Load the data when the page loads
window.onload = loadAbout;

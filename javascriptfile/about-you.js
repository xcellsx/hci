document.addEventListener("DOMContentLoaded", function() {
    function saveProfile() {
        const occupation = document.getElementById('occupation').value;
        const income = document.getElementById('income').value;
        const curExp = document.getElementById('cur-exp').value;
        const tarExp = document.getElementById('tar-exp').value;

        const aboutData = {
            occupation: occupation,
            income: income,
            curExp: curExp,
            tarExp: tarExp
        };

        localStorage.setItem('aboutData', JSON.stringify(aboutData));
    }

    function goToNextPage() {
        saveProfile();
        window.location.href = 'cats.html'; // Replace with the actual URL of the next page
    }

    document.getElementById('nextButton').addEventListener('click', goToNextPage);
});

document.addEventListener("DOMContentLoaded", function() {
    const nameElement = document.getElementById("name");
    const usernameElement = document.getElementById("username");
    const emailElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");
    const occupationElement = document.getElementById("occupationDisplay");
    const incomeElement = document.getElementById("incomeDisplay");
    const curExpElement = document.getElementById("curExpDisplay");
    const tarExpElement = document.getElementById("tarExpDisplay");
    const goalsElement = document.getElementById("goalsDisplay");
    const categoriesElement = document.getElementById("categoriesDisplay");
    const editIcon = document.getElementById("edit-icon");

    function displayProfileInfo() {
        const profileData = JSON.parse(localStorage.getItem('aboutData')) || {};
        const name = localStorage.getItem('name') || 'User';
        const username = localStorage.getItem('username') || 'Username';
        const email = localStorage.getItem('email') || 'Email';
        const password = localStorage.getItem('password') || '*******';
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];

        nameElement.textContent = `${name}`;
        usernameElement.textContent = `${username}`;
        emailElement.textContent = `${email}`;
        passwordElement.textContent = `${password}`;
        occupationElement.textContent = `${profileData.occupation || 'Occupation'}`;
        incomeElement.textContent = `${profileData.income || 'Income'}`;
        curExpElement.textContent = `${profileData.curExp || 'Current Monthly Expenses'}`;
        tarExpElement.textContent = `${profileData.tarExp || 'Target Monthly Expenses'}`;
        goalsElement.textContent = `${goals.join(", ")}`;
        categoriesElement.textContent = `${selectedCategories.join(", ")}`;
    }

    window.onload = function() {
        displayProfileInfo();
    };

    editIcon.addEventListener("click", function() {
        const profileData = JSON.parse(localStorage.getItem('aboutData')) || {};
        const name = localStorage.getItem('name') || 'User';
        const username = localStorage.getItem('username') || 'Username';
        const email = localStorage.getItem('email') || 'Email';
        const password = localStorage.getItem('password') || '*******';

        nameElement.innerHTML = `<input type="text" id="nameInput" value="${name}" class="form-control">`;
        usernameElement.innerHTML = `<input type="text" id="usernameInput" value="${username}" class="form-control">`;
        emailElement.innerHTML = `<input type="email" id="emailInput" value="${email}" class="form-control">`;
        passwordElement.innerHTML = `<input type="password" id="passwordInput" value="${password}" class="form-control">`;
        occupationElement.innerHTML = `<input type="text" id="occupationInput" value="${profileData.occupation || ''}" class="form-control">`;
        incomeElement.innerHTML = `<input type="text" id="incomeInput" value="${profileData.income || ''}" class="form-control">`;
        curExpElement.innerHTML = `<input type="text" id="curExpInput" value="${profileData.curExp || ''}" class="form-control">`;
        tarExpElement.innerHTML = `<input type="text" id="tarExpInput" value="${profileData.tarExp || ''}" class="form-control">`;

        const saveButton = document.createElement("button");
        saveButton.className = "btn btn-custom mt-2";
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", saveProfile);
        tarExpElement.appendChild(saveButton);
    });

    function saveProfile() {
        const newName = document.getElementById("nameInput").value;
        const newUsername = document.getElementById("usernameInput").value;
        const newEmail = document.getElementById("emailInput").value;
        const newPassword = document.getElementById("passwordInput").value;
        const newOccupation = document.getElementById("occupationInput").value;
        const newIncome = document.getElementById("incomeInput").value;
        const newCurExp = document.getElementById("curExpInput").value;
        const newTarExp = document.getElementById("tarExpInput").value;

        localStorage.setItem('name', newName);
        localStorage.setItem('username', newUsername);
        localStorage.setItem('email', newEmail);
        localStorage.setItem('password', newPassword);

        const aboutData = {
            occupation: newOccupation,
            income: newIncome,
            curExp: newCurExp,
            tarExp: newTarExp
        };

        localStorage.setItem('aboutData', JSON.stringify(aboutData));

        nameElement.textContent = `${newName}`;
        usernameElement.textContent = `${newUsername}`;
        emailElement.textContent = `${newEmail}`;
        passwordElement.textContent = `********`;
        occupationElement.textContent = `${newOccupation}`;
        incomeElement.textContent = `${newIncome}`;
        curExpElement.textContent = `${newCurExp}`;
        tarExpElement.textContent = `${newTarExp}`;

        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();
    }
});

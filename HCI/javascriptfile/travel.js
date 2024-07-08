document.addEventListener('DOMContentLoaded', function() {
    // Load checkbox states from localStorage
    document.querySelectorAll('.doneCheckbox').forEach(checkbox => {
        const row = checkbox.closest('tr');
        const date = row.dataset.date;
        const isChecked = localStorage.getItem(`checkbox-${date}`) === 'true';
        checkbox.checked = isChecked;
        updateAmountSaved(checkbox, isChecked);
    });

    updateTotalSaved();
});

document.getElementById('doneHeaderCheckbox').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.doneCheckbox');
    const isChecked = this.checked;

    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        updateAmountSaved(checkbox, isChecked);
        // Save checkbox state to localStorage
        const row = checkbox.closest('tr');
        const date = row.dataset.date;
        localStorage.setItem(`checkbox-${date}`, isChecked);
    });

    updateTotalSaved();
});

document.querySelectorAll('.doneCheckbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const row = checkbox.closest('tr');
        const date = row.dataset.date;
        const isChecked = this.checked;
        updateAmountSaved(this, isChecked);
        updateTotalSaved();
        // Save checkbox state to localStorage
        localStorage.setItem(`checkbox-${date}`, isChecked);
    });
});

function updateAmountSaved(checkbox, isChecked) {
    const row = checkbox.closest('tr');
    const toSave = parseInt(row.querySelector('.to-save').textContent);
    const amountSavedCell = row.querySelector('.amount-saved');
    let amountSaved = parseInt(amountSavedCell.textContent) || 0;

    if (isChecked) {
        amountSavedCell.textContent = toSave;
    } else {
        amountSavedCell.textContent = 0;
    }
}

function updateTotalSaved() {
    let totalSaved = 0;
    document.querySelectorAll('.amount-saved').forEach(cell => {
        totalSaved += parseInt(cell.textContent) || 0;
    });
    document.getElementById('totalSaved').textContent = totalSaved;

    updateProgressBar(totalSaved);
}

function updateProgressBar(totalSaved) {
    const goalAmount = 1900;
    const progress = (totalSaved / goalAmount) * 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
    progressBar.textContent = Math.round(progress) + '%';
}

// Initial calculation of total saved
updateTotalSaved();
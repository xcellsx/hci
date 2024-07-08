function addSubcategory() {
    const subcategoryInput = document.getElementById('newSubcategory');
    const subcategoryValue = subcategoryInput.value.trim();

    if (subcategoryValue) {
        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.classList.add('subcategory-div');
        subcategoryDiv.innerText = subcategoryValue;

        // Add delete button
        const deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = 'x';
        deleteBtn.addEventListener('click', function() {
            subcategoryDiv.remove();
        });
        subcategoryDiv.appendChild(deleteBtn);

        const subcategoriesContainer = document.getElementById('subcategories');
        subcategoriesContainer.appendChild(subcategoryDiv);

        // Clear the input field
        subcategoryInput.value = '';
    }
}
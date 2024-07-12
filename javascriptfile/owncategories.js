const selectedCategories = new Set(JSON.parse(localStorage.getItem('selectedCategories')) || []);

// Initialize selected categories from localStorage
highlightSelectedCategories();

function toggleCategory(element) {
    const category = element.textContent;

    if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        element.classList.remove('selected');
    } else {
        selectedCategories.add(category);
        element.classList.add('selected');
    }

    updateSelectedCategories();
}

function updateSelectedCategories() {
    const selectedList = document.getElementById('selectedList');
    selectedList.innerHTML = ''; // Clear previous selections

    selectedCategories.forEach(category => {
        const span = document.createElement('span');
        span.className = 'selected-category';
        span.textContent = category;
        span.onclick = () => removeCategory(category); // Add click event to remove category
        selectedList.appendChild(span);
    });

    // Save to localStorage whenever the list is updated
    localStorage.setItem('selectedCategories', JSON.stringify([...selectedCategories]));
}

function saveCategories() {
    localStorage.setItem('selectedCategories', JSON.stringify([...selectedCategories]));
    alert("Categories saved!");
}

function removeCategory(category) {
    selectedCategories.delete(category);
    const categoryElement = Array.from(document.querySelectorAll('.category')).find(el => el.textContent === category);
    if (categoryElement) {
        categoryElement.classList.remove('selected');
    }
    updateSelectedCategories();
}

// Highlight selected categories on page load
function highlightSelectedCategories() {
    selectedCategories.forEach(category => {
        const categoryElement = Array.from(document.querySelectorAll('.category')).find(el => el.textContent === category);
        if (categoryElement) {
            categoryElement.classList.add('selected');
        }
    });

    // Populate the selected categories list on page load
    updateSelectedCategories();
}

document.addEventListener("DOMContentLoaded", function() {
    function toggleCategory(element) {
        element.classList.toggle("selected");
        updateCategoryStyle(element);
    }

    function updateCategoryStyle(element) {
        if (element.classList.contains("selected")) {
            element.style.backgroundColor = "var(--dark-blue)";
            element.style.color = "white";
        } else {
            element.style.backgroundColor = "";
            element.style.color = "";
        }
    }

    function saveCategories() {
        const selectedCategories = document.querySelectorAll(".category.selected");
        const categories = Array.from(selectedCategories).map(category => category.textContent.trim());
        localStorage.setItem('selectedCategories', JSON.stringify(categories));
    }

    function goToNextPage() {
        saveCategories();
        window.location.href = 'loading.html'; // Replace 'loading.html' with the actual URL of your loading page
    }

    document.getElementById('nextButton').addEventListener('click', goToNextPage);

    window.toggleCategory = toggleCategory;

    function loadSelectedCategories() {
        const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
        const categoryElements = document.querySelectorAll(".category");
        categoryElements.forEach(category => {
            if (selectedCategories.includes(category.textContent.trim())) {
                category.classList.add("selected");
                updateCategoryStyle(category);
            }
        });
    }

    loadSelectedCategories();
});

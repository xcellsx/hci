document.addEventListener('DOMContentLoaded', () => {
loadGoals();

const goalForm = document.getElementById('goal-form');
goalForm.addEventListener('submit', (event) => {
event.preventDefault();
const categoryName = document.getElementById('category-name').value.trim();

if (categoryName) {
    addCategoryToStorage(categoryName);
    addCategoryToDOM(categoryName);
    const modal = bootstrap.Modal.getInstance(document.getElementById('goalModal'));
    modal.hide();
    goalForm.reset();
}
});
});

function loadGoals() {
const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
const goalsOverview = document.getElementById('goals-overview');
goalsOverview.innerHTML = '';

selectedCategories.forEach((category, index) => {
addCategoryToDOM(category, index);
});
}

function addCategoryToStorage(category) {
const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
selectedCategories.push(category);
localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
}

function addCategoryToDOM(category, index) {
const goalsOverview = document.getElementById('goals-overview');
const goalCard = document.createElement('div');
goalCard.classList.add('goal-card', 'p-3', 'mb-3', 'position-relative');
goalCard.setAttribute('draggable', 'true');

// Define category URLs
const categoryUrls = {
"School": "school.html",
"Travel": "travel.html",
};

const url = categoryUrls[category] || "#"; // Default to "#" if category not found

goalCard.innerHTML = `
<h5 class="goal-name">${category}</h5>
<button class="btn btn-danger delete-btn position-absolute top-50 end-0 translate-middle-y d-none" data-index="${index}">Delete</button>
<a href="${url}" class="btn btn-custom">See Goals</a>
`;

goalsOverview.appendChild(goalCard);
}

function handleDragStart(event) {
event.currentTarget.classList.add('dragging');
}

function handleDragEnd(event) {
const goalCard = event.currentTarget;
goalCard.classList.remove('dragging');

const deleteBtn = goalCard.querySelector('.delete-btn');
const currentPosition = goalCard.getBoundingClientRect();
const containerPosition = goalCard.parentElement.getBoundingClientRect();
const threshold = containerPosition.width * 0.2;  // 20% of the container width

if (currentPosition.right - containerPosition.left > threshold) {
deleteBtn.classList.remove('d-none');
} else {
deleteBtn.classList.add('d-none');
}
}

function showConfirmDeleteModal(index) {
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const confirmDeleteButton = document.getElementById('confirm-delete');

confirmDeleteButton.onclick = () => {
deleteCategory(index);
confirmDeleteModal.hide();
};

confirmDeleteModal.show();
}

function deleteCategory(index) {
const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
selectedCategories.splice(index, 1);
localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
loadGoals();
}

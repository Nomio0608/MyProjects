let recipesData = [];
let ingredientsData = [];
let fridgeIngredients = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.recipes) {
                recipesData = data.recipes;
            } else {
                console.error('Data format error: No "recipes" array in JSON');
            }
        })
        .catch(error => console.error('Error fetching recipes:', error));

    const ingredientContainers = document.querySelectorAll('.category label');
    const fridgeIngredientsContainer = document.getElementById('fridge-ingredients');
    const clearFridgeBtn = document.getElementById('clear-fridge');
    const findRecipesBtn = document.getElementById('find-recipes');
    const recipeList = document.getElementById('recipe-list');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');

    setupIngredientListeners(ingredientContainers, fridgeIngredientsContainer);
    setupCustomIngredientInput(addIngredientBtn, fridgeIngredientsContainer);
    setupClearFridge(clearFridgeBtn, ingredientContainers, fridgeIngredientsContainer);
    setupRecipeSearch(findRecipesBtn, recipeList);
});

function setupIngredientListeners(ingredientContainers, fridgeIngredientsContainer) {
    ingredientContainers.forEach(label => {
        label.addEventListener('click', () => {
            const ingredient = label.textContent.trim();
            addToFridge(ingredient, label, fridgeIngredientsContainer);
        });
    });
}

function addToFridge(ingredient, label, container) {
    if (!fridgeIngredients.includes(ingredient)) {
        fridgeIngredients.push(ingredient);
        label.style.backgroundColor = '#f90';
        updateFridgeDisplay(container);
    }
}

function removeFromFridge(ingredient, ingredientContainers, container) {
    fridgeIngredients = fridgeIngredients.filter(item => item !== ingredient);
    ingredientContainers.forEach(label => {
        if (label.textContent.trim() === ingredient) {
            label.style.backgroundColor = '';
        }
    });
    updateFridgeDisplay(container);
}

function updateFridgeDisplay(container) {
    container.innerHTML = '';
    fridgeIngredients.forEach(ingredient => {
        const ingredientItem = document.createElement('span');
        ingredientItem.textContent = ingredient;
        ingredientItem.classList.add('fridge-item');
        ingredientItem.addEventListener('click', () => {
            const ingredientContainers = document.querySelectorAll('.category label');
            removeFromFridge(ingredient, ingredientContainers, container);
        });
        container.appendChild(ingredientItem);
    });
}

function setupCustomIngredientInput(addButton, container) {
    addButton.addEventListener('click', async () => {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const newIngredientInput = document.getElementById('new-ingredient');
        const newIngredient = newIngredientInput.value.trim();
        
        if (newIngredient && !fridgeIngredients.includes(newIngredient)) {
            fridgeIngredients.push(newIngredient);
            updateFridgeDisplay(container);
            newIngredientInput.value = '';
        }

        const response = await fetch('/api/insert-ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredient: newIngredient, userId: userId })
        });
        const data = await response.json();
        if (data.success) {
            console.log('Ingredient added successfully');
        } else {
            console.error('Failed to add ingredient');
        }
    });
}

function setupClearFridge(clearButton, ingredientContainers, container) {
    clearButton.addEventListener('click', () => {
        fridgeIngredients = [];
        ingredientContainers.forEach(label => label.style.backgroundColor = '');
        updateFridgeDisplay(container);
    });
}

function setupRecipeSearch(findButton, recipeList) {
    findButton.addEventListener('click', () => {
        recipeList.innerHTML = ''; 
        
        const availableRecipes = recipesData.filter(recipe =>
            fridgeIngredients.every(fridgeIng =>
                recipe.ingredients.includes(fridgeIng)
            )
        );

        if (availableRecipes.length === 0) {
            const noResultMessage = document.createElement('p');
            noResultMessage.textContent = 'Тохирох жор олдсонгүй.';
            noResultMessage.style.color = '#0d0d0d';
            noResultMessage.style.textAlign = 'center';
            recipeList.appendChild(noResultMessage);
            return;
        }

        availableRecipes.forEach(recipe => {
            const recipeItem = document.createElement('li');
            recipeItem.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}" style="width: 100px; height: 100px; border-radius: 5px; margin-right: 10px;">
                <a href="/htmls/hool_detail.html?id=${recipe.id}" style="text-decoration: none; color: #333; font-weight: bold;">${recipe.name}</a>
            `;
            recipeItem.style.display = 'flex';
            recipeItem.style.alignItems = 'center';
            recipeItem.style.padding = '10px';
            recipeItem.style.backgroundColor = '#f9f9f9';
            recipeItem.style.borderRadius = '5px';
            recipeItem.style.marginBottom = '10px';
            recipeList.appendChild(recipeItem);
        });
    });
}
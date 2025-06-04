import './components/FilterButton.js';
import './components/Pagination.js';
import './components/RecipeCard.js';
import './components/SearchInput.js';

class RecipeApp {
    constructor() {
        this.currentPage = 1;
        this.recipesData = [];
        this.filteredData = [];
        this.itemsPerPage = 4;
    }

    async init() {
        await this.fetchRecipes();
        this.setupEventListeners();
    }

    async fetchRecipes() {
        try {
            const response = await fetch('/api/recipes');
            const data = await response.json();
            
            if (data && data.recipes) {
                this.recipesData = data.recipes;
                this.filteredData = this.recipesData;
                this.displayRecipes(this.currentPage);
                this.updatePagination();
            }
        } catch (error) {
            console.error('Recipe Fetch Error:', error);
            document.getElementById('recipes-status').textContent = 'Жорыг ачаалж чадсангүй';
        }
    }

    setupEventListeners() {
        document.addEventListener('filter-click', (e) => {
            const filter = e.detail.filter;
            this.applyFilter(filter);
        });

        document.addEventListener('search', (e) => {
            const query = e.detail.query;
            this.filterRecipes(query);
        });

        document.addEventListener('page-change', (e) => {
            this.currentPage = e.detail.page;
            this.displayRecipes(this.currentPage);
            this.updatePagination();
        });
    }

    displayRecipes(page) {
        const recipeGrid = document.querySelector('.recipe-grid');
        recipeGrid.innerHTML = '';

        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const recipesToDisplay = this.filteredData.slice(start, end);

        if (recipesToDisplay.length === 0) {
            recipeGrid.innerHTML = '<p>Энэ төрлийн жор олдсонгүй.</p>';
            return;
        }

        recipesToDisplay.forEach(recipe => {
            const recipeCard = document.createElement('recipe-card');
            recipeCard.recipe = recipe;
            recipeGrid.appendChild(recipeCard);
        });
    }

    applyFilter(filter) {
        this.filteredData = filter === 'All' 
            ? this.recipesData 
            : this.recipesData.filter(recipe => 
                recipe.mealType.some(type => type === filter)
            );

        this.currentPage = 1;
        this.displayRecipes(this.currentPage);
        this.updatePagination();
    }

    filterRecipes(query) {
        this.filteredData = this.recipesData.filter(recipe =>
            recipe.name.toLowerCase().includes(query.toLowerCase())
        );

        this.currentPage = 1;
        this.displayRecipes(this.currentPage);
        this.updatePagination();
    }

    updatePagination() {
        const pagination = document.querySelector('page-pagination');
        pagination.pages = {
            current: this.currentPage,
            total: Math.ceil(this.filteredData.length / this.itemsPerPage)
        };
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const recipeApp = new RecipeApp();
    recipeApp.init();
});

export default RecipeApp;
import './like-button.js';
import './user-auth.js';

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('user'));
}

document.addEventListener('DOMContentLoaded', () => {
    const user = getLoggedInUser();
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    
    if (!user) {
        console.error('No user logged in.');
        return;
    }

    console.log('app.js is loaded and running');

    const likedRecipes = user.likedFoods;
    
    if (!likedRecipes || likedRecipes.length === 0) {
        console.warn('User has no liked recipes.');
        return;
    }
    const likeButtonContainer = document.querySelector('.like-button-container');
    if (likeButtonContainer) {
        console.log(recipeId)
        likeButtonContainer.innerHTML = `<like-button recipe-id="${recipeId}"></like-button>`;
    }

    const likedRecipesContainer = document.querySelector('.liked-recipes-container');
    if (likedRecipesContainer) {
        likedRecipesContainer.innerHTML =  `<liked-recipes user-id="${user.userId}"></liked-recipes>`;
    }

});

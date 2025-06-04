// Joriin id-gaas hamaaran delgerengui medeelel gargah funkts 
function navigateToRecipe(recipeId) {
   
    window.location.href = `/htmls/hool_detail.html?id=${recipeId}`;
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded successfully");

// Хүнсний жагсаалт дахь бүх хүнсний зүйлд click үйл явдлын сонсогчдыг хавсаргана
    const foodItems = document.querySelectorAll(".food-item");
    foodItems.forEach(foodItem => {
        // HTML дээр аль хэдийн тодорхойлсон onclick функцийг задлах
        const navigateToRecipeId = foodItem.getAttribute("onclick");
        if (navigateToRecipeId) {
            foodItem.addEventListener("click", () => {
                eval(navigateToRecipeId);
            });
        }
    });
});

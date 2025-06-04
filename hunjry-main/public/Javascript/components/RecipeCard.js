export default class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._recipe = null;
    }

    set recipe(data) {
        this._recipe = data;
        this.render();
    }

    get recipe() {
        return this._recipe;
    }

    render() {
        if (!this._recipe) return;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Carlito', sans-serif;
                }

                .recipe-card {
                    display: flex;
                    background-color: #fff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    position: relative;
                    width: 750px;
                    height: 320px;
                    text-align: left;
                }

                .recipe-card img {
                    width: 50%;
                    height: 100%;
                    object-fit: cover;
                }

                .food-info {
                    display: flex;
                    flex-direction: column;
                    padding: 15px;
                    width: 50%;
                    justify-content: center;
                }

                .ports {
                    display: flex;
                    justify-content: left;
                    gap: 5px;
                    flex-wrap: wrap;
                }

                .ports img {
                    width: 30px;
                    height: 30px;
                }

                .recipe-card h3 {
                    font-size: 24px;
                    margin: 10px 0;
                    color: #000;
                }

                .recipe-card p {
                    font-size: 14px;
                    color: #777;
                    margin: 5px 0;
                }

                .view-recipe-btn {
                    background-color: rgb(152, 73, 147);
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 20px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 10px;
                    text-decoration: none;
                    width: 6.55rem;
                    opacity: 1;
                }

                .view-recipe-btn:hover {
                    background-color: white;
                    color: #c04ad2;
                    border: 1px solid #f90;
                }

                a {
                    text-decoration: none;
                    color: #000;
                }

                @media (max-width: 768px) {
                    .recipe-card h3 {
                        padding: 0;
                        margin: 0;
                        font-size: 16px;
                    }

                    .recipe-card p {
                        padding: 0;
                        font-size: 12px;
                    }

                    .ports img {
                        width: 25px;
                        height: 25px;
                    }

                    .ports {
                        overflow-y: hidden;
                    }

                    .view-recipe-btn {
                        padding: 8px 15px;
                        width: 75px;
                        height: 30px;
                        font-size: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .recipe-card {
                        height: 200px;
                    }

                    .recipe-card h3 {
                        font-size: 14px;
                    }

                    .recipe-card p {
                        font-size: 12px;
                    }

                    .view-recipe-btn {
                        width: 100%;
                    }
                }

                @media (prefers-color-scheme: dark) {
                    .recipe-card {
                        background-color: #fff;
                        color: #f5f5f5;
                    }

                    .recipe-card h3 {
                        color: #000;
                    }
                }
            </style>
            <section class="recipe-card">
                <img src="${this._recipe.image}" alt="${this._recipe.name}" class="food-pic">
                <section class="food-info">
                    <h3>${this._recipe.name}</h3>
                    <p>${this._recipe.caloriesPerServing || 'N/A'} кал</p>
                    <section class="ports">
                        ${this.renderServings(this._recipe.servings)}
                    </section>
                    <a href="/htmls/hool_detail.html?id=${this._recipe.id}">
                        <button class="view-recipe-btn">Жор харах</button>
                    </a>
                </section>
            </section>
        `;

        this.setupEventListeners();
    }

    renderServings(servings) {
        return servings 
            ? '<img src="/iconpic/profile.png">'.repeat(servings) 
            : 'N/A';
    }

    setupEventListeners() {
        const viewButton = this.shadowRoot.querySelector('.view-recipe-btn');
        viewButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('recipe-view', {
                detail: { recipeId: this._recipe.id },
                bubbles: true
            }));
        });
    }
}

customElements.define('recipe-card', RecipeCard);

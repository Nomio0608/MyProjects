class LikedRecipesComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const userId = this.getAttribute('user-id');
        if (!userId) return;

        console.log('📌 LikedRecipesComponent is loaded and running');
        
        this.render(); // Show initial structure before loading
        await this.loadLikedRecipes(userId);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .recipes-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;
                    padding: 30px;
                    width: 100%;
                }
                
                article {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: transform 0.2s ease;
                    width: 100%;
                    min-width: 300px;
                }
                
                img {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 12px 12px 0 0;
                }
                
                a {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                }
                
                p {
                    color: #333;
                    padding: 20px;
                    margin: 0;
                    font-size: 18px;
                    text-align: center;
                    font-weight: 500;
                }
                
                @media (max-width: 1400px) {
                    .recipes-container {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 900px) {
                    .recipes-container {
                        grid-template-columns: repeat(1, 1fr);
                        padding: 20px;
                    }
                    
                    article {
                        min-width: unset;
                    }
                    
                    img {
                        height: 250px;
                    }
                }
            </style>
            <div class="recipes-container">
                <p>Хоолнуудыг ачаалж байна...</p>
            </div>
        `;
    }

    async loadLikedRecipes(userId) {
        try {
            const response = await fetch(`/api/user/${userId}/liked-recipes`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const likedRecipes = await response.json();
            console.log('📌 Liked Recipes:', likedRecipes);

            const container = this.shadowRoot.querySelector('.recipes-container');
            container.innerHTML = ''; 

            if (!Array.isArray(likedRecipes) || likedRecipes.length === 0) {
                container.innerHTML = '<p>Таньд одоогоор таалагдсан хоол байхгүй байна.</p>';
                return;
                }

            likedRecipes.forEach(recipe => {
                if (recipe) {
                    const articleElement = document.createElement('article');
                    articleElement.innerHTML = `
                        <a href="/htmls/hool_detail.html?id=${recipe.id}">
                            <img src="${recipe.image}" alt="${recipe.name}">
                            <p>${recipe.name}</p>
                        </a>
                    `;
                    container.appendChild(articleElement);
                    console.log(`✅ ${recipe.name} -ийг ачааллаа`);
                }
            });
        } catch (error) {
            console.error('❌ Error loading liked recipes:', error);
            this.shadowRoot.querySelector('.recipes-container').innerHTML = `
                <p>Таалагдсан хоолнуудыг ачаалахад алдаа гарлаа.</p>
            `;
        }
    }
}

customElements.define('liked-recipes', LikedRecipesComponent);
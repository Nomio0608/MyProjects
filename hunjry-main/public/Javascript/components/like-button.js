export default class LikeButtonComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const recipeId = parseInt(this.getAttribute('recipe-id'));
        if (!recipeId) return;

        this.render();
        this.setupLikeButton(recipeId);
        this.applyTheme();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --button-bg: var(--primary-bg, #f8f8f8);
                    --button-border: var(--primary-border, #6C837B);
                    --button-hover-bg: var(--hover-bg, #6C837B);
                    --button-active-bg: var(--active-bg, #ff4d6d);
                    --button-icon-filter: var(--icon-filter, invert(0));
                    --button-disabled-bg: var(--disabled-bg, #ccc);
                }

                :host([data-theme="dark"]) {
                    --button-bg: var(--dark-bg, #333);
                    --button-border: var(--dark-border, #999);
                    --button-hover-bg: var(--dark-hover-bg, #555);
                    --button-active-bg: var(--dark-active-bg, #ff4d6d);
                    --button-icon-filter: var(--dark-icon-filter, invert(1));
                    --button-disabled-bg: var(--dark-disabled-bg, #444);
                }

                .heart-button {
                    background: var(--button-bg);
                    border: 2px solid var(--button-border);
                    border-radius: 50%;
                    cursor: pointer;
                    padding: 8px;
                    transition: all 0.3s ease;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .heart-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(108, 131, 123, 0.3);
                }

                /* Default button state */
                :host([state="idle"]) .heart-button {
                    background-color: var(--button-bg);
                    border-color: var(--button-border);
                }

                /* Active state */
                :host([state="active"]) .heart-button {
                    background-color: var(--button-active-bg);
                    border-color: var(--button-active-bg);
                }

                /* Disabled state */
                :host([state="disabled"]) .heart-button {
                    background-color: var(--button-disabled-bg);
                    border-color: var(--button-disabled-bg);
                    cursor: not-allowed;
                }

                .heart-button:hover {
                    transform: scale(1.1);
                    background-color: var(--button-hover-bg);
                }

                .heart-button:hover img {
                    filter: var(--button-icon-filter);
                }

                .heart-button img {
                    width: 25px;
                    height: 25px;
                    transition: filter 0.3s ease;
                }
            </style>

            <button class="heart-button">
                <slot name="icon">
                    <img src="/iconpic/heart.png" alt="like">
                </slot>
            </button>
            <slot name="button-text"></slot>
        `;
    }

    async setupLikeButton(recipeId) {
        const likeButton = this.shadowRoot.querySelector('.heart-button');
        if (!likeButton) {
            console.error("Like button not found.");
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.userId) {
            console.error("User not found in local storage.");
            return;
        }

        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Failed to fetch user data.');

            const userData = await response.json();
            const currentUser = userData.users.find(u => u.userId === user.userId);
            if (!currentUser) throw new Error('User not found in API response.');

            if (currentUser.likedFoods.includes(recipeId)) {
                this.setState('active');
            } else {
                this.setState('idle');
            }

        } catch (error) {
            console.error('User Fetch Error:', error);
            alert('Хэрэглэгчийн мэдээлэл татаж чадсангүй');
            return;
        }

        likeButton.addEventListener('click', async () => {
            try {
                const likeResponse = await fetch('/api/like-food', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.userId, recipeId: recipeId })
                });

                if (!likeResponse.ok) throw new Error(`HTTP error! Status: ${likeResponse.status}`);

                const data = await likeResponse.json();
                if (data.success) {
                    if (this.getAttribute('state') === 'active') {
                        this.setState('idle');
                    } else {
                        this.setState('active');
                    }
                } else {
                    alert('Алдаа гарлаа: ' + (data.message || 'Тодорхойгүй алдаа'));
                }
            } catch (error) {
                alert('Алдаа гарлаа');
            }
        });
    }

    setState(state) {
        this.setAttribute('state', state);  
    }

    applyTheme() {
        const root = document.documentElement;
        const isDarkMode = root.getAttribute('data-theme') === 'dark';
        this.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

        const observer = new MutationObserver(() => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            this.setAttribute('data-theme', isDark ? 'dark' : 'light');
        });

        observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
}

customElements.define('like-button', LikeButtonComponent);

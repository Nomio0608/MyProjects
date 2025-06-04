export default class FilterButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            filter: '',
            isActive: false
        };
    }

    static get observedAttributes() {
        return ['filter', 'active'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .filter-btn {
                    padding: 10px 20px;
                    border: none;
                    background-color: #fff;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }

                .filter-btn.active {
                    background-color: #e7aa46;
                    color: #f5f4f2;
                }

                /* Media query from your CSS */
                @media (max-width: 768px) {
                    .filter-btn {
                        font-size: 12px;
                        padding: 8px 15px;
                    }
                }

                /* Import font */
                @import url('https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap');

                :host {
                    font-family: 'Carlito', sans-serif;
                }
            </style>
            <button class="filter-btn ${this.state.isActive ? 'active' : ''}" 
                    data-filter="${this.state.filter}">
                ${this.state.filter}
            </button>
        `;
    }

    setupEventListeners() {
        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('filter-click', {
                detail: { filter: this.state.filter },
                bubbles: true
            }));
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'filter') this.state.filter = newValue;
        if (name === 'active') this.state.isActive = newValue !== null;
        this.render();
    }
}

customElements.define('filter-btn', FilterButton);
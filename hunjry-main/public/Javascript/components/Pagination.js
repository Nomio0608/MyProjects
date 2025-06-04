export default class Pagination extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            current: 1,
            total: 0
        };
    }

    set pages({ current, total }) {
        this.state.current = current;
        this.state.total = total;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap');

                :host {
                    font-family: 'Carlito', sans-serif;
                    display: block;
                }

                .pagination {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    padding-bottom: 20px;
                }

                .pagination-circle {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background-color: transparent;
                    border: 1px solid #f90;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #333;
                    font-size: 14px;
                    font-weight: bold;
                }

                .pagination-circle.active {
                    background-color: #e7aa46;
                    color: white;
                }

                @media (max-width: 768px) {
                    .pagination {
                        gap: 10px;
                    }
                    
                    .pagination-circle {
                        width: 25px;
                        height: 25px;
                        font-size: 12px;
                    }
                }

                @media (max-width: 480px) {
                    .pagination {
                        padding-bottom: 15px;
                    }
                    
                    .pagination-circle {
                        width: 20px;
                        height: 20px;
                        font-size: 11px;
                    }
                }

                @media (prefers-color-scheme: dark) {
                    .pagination-circle {
                        color: #f5f5f5;
                    }
                }
            </style>
            <div class="pagination">
                ${this.renderPageButtons()}
            </div>
        `;
        this.addPageButtonListeners();
    }

    renderPageButtons() {
        if (this.state.total === 0) {
            return '<p>No pages to display.</p>';
        }

        return Array.from({length: this.state.total}, (_, i) => {
            const pageNumber = i + 1;
            return `
                <button 
                    class="pagination-circle ${pageNumber === this.state.current ? 'active' : ''}"
                    data-page="${pageNumber}"
                    aria-label="Page ${pageNumber}"
                    ${pageNumber === this.state.current ? 'aria-current="page"' : ''}>
                    ${pageNumber}
                </button>
            `;
        }).join('');
    }

    addPageButtonListeners() {
        this.shadowRoot.querySelectorAll('.pagination-circle').forEach(button => {
            button.addEventListener('click', () => {
                const pageNumber = parseInt(button.dataset.page);
                this.dispatchEvent(new CustomEvent('page-change', {
                    detail: { page: pageNumber },
                    bubbles: true
                }));
            });
        });
    }
}

customElements.define('page-pagination', Pagination);
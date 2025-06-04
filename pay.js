
class Orders {
    
    async init(){
        try {
            const urlParams = new URLSearchParams(document.location.search);
            const idParam = urlParams.get("id");

            const rs = await fetch('/scripts/artist.json');
            const response = await rs.json()
            const products = response.record.products

           

            const artistsContainer = document.getElementById("pay-order")
            const ProductsContainer = document.getElementById("products")
            if(idParam){    
                const filtered = products.find((item) => item.id == idParam);
                artistsContainer.innerHTML = `<my-order id="${filtered.id}" artist="${filtered.artist}" img="${filtered.img}" year="${filtered.year}" reward="${filtered.reward}" count="${filtered.count}"></my-order> `
                filtered.makeup.map(item => {
                    ProductsContainer.innerHTML += `<artist-product id="${filtered.id}" artist="${filtered.artist}" img="${item.img}" count="${item.count}"></artist-product>`;
                });
               
            }
            
        
        } catch (error) {
            
        }
    }
}

var orders = new Orders();
orders.init();
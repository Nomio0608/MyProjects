class OrderPage {
    async Init() {
        try {
            const rs = await fetch('/scripts/artist.json');
            const response = await rs.json();
            const products = response.record.products;

            const artistContainer = document.getElementById("artist-container");
            products.sort((a, b) => b.count - a.count);
            console.log(products)
            products.forEach(item => {
                const artistElement = document.createElement('my-artist');
                artistElement.id = item.id;
                artistElement.artist = item.artist;
                artistElement.img = item.img;
                artistElement.year = item.year;
                artistElement.reward = item.reward;
                artistElement.count = item.count;
                artistContainer.appendChild(artistElement);
            });

        } catch (error) {
            console.log(error);
        }
    }
}
(async () => {
  const order = new OrderPage();
  await order.Init();
})();
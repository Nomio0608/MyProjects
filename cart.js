document.addEventListener("DOMContentLoaded", () => {
    const cart = document.getElementById("cartbody");
    const userid = localStorage.getItem('userId');

    fetch(`http://127.0.0.1:3002/getorder/${userid}`)
        .then((result) => result.json())
        .then((resultObj) => {
            console.log(resultObj);

            // htmlin hoosloh
            cart.innerHTML = '';

            // orj irj bga data hooson uguig shalgah
            if (resultObj.length > 0) {
                resultObj.forEach(order => {
                    //neg burchlen div uusgeh
                    const orderDiv = document.createElement('div');
                    orderDiv.className = 'order-item';

                    const orderDate = new Date(order.order_date).toLocaleDateString();

                    // html
                    orderDiv.innerHTML = `
                    <img class="cart-img" src="${order.img}" alt="Artist Image">
                        <div class="cart-details">
                            <p>Артист: ${order.artist}</p>
                            <p>Цаг: ${order.hour_time}</p>
                            <p>Өдөр: ${order.day_name}</p>
                            <p class="order-date">Захиалсан өдөр: ${orderDate}</p>
                        </div>
                    `;
                    cart.appendChild(orderDiv);
                });
            } else {
                cart.innerHTML = '<p>No orders found.</p>';
            }
        })
        .catch((error) => {
            console.error('Error fetching orders:', error);
            cart.innerHTML = '<p>Failed to load orders. Please try again later.</p>';
        });
});

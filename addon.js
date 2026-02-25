// simple interactivity for purchase button
const buyButton = document.getElementById('buy-button');

if (buyButton) {
  buyButton.addEventListener('click', () => {
    alert('Thank you for your purchase! (Not really – this is a troll site)');
  });
}

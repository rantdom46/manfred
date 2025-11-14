const listItems = document.querySelectorAll("ul li");
const beerImages = document.querySelectorAll(".beer-images img");

function resetActive() {
  beerImages.forEach(img => img.classList.remove("active"));
  listItems.forEach(li => li.classList.remove("active"));
}

// Hover + Click
listItems.forEach(item => {
  const beerId = item.dataset.beer;
  const targetImg = document.getElementById(beerId);

  // Hover (desktop)
  item.addEventListener("mouseenter", () => {
    resetActive();
    targetImg.classList.add("active");
    item.classList.add("active");
  });
  item.addEventListener("mouseleave", () => {
    resetActive();
  });

  // Click / Tap (mobile)
  item.addEventListener("click", () => {
    if(targetImg.classList.contains("active")) {
      targetImg.classList.remove("active");
      item.classList.remove("active");
    } else {
      resetActive();
      targetImg.classList.add("active");
      item.classList.add("active");
    }
  });
});

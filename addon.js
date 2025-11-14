// --- Bier Hover & Click ---
const listItems = document.querySelectorAll("ul li");
const beerImages = document.querySelectorAll(".beer-images img");

function resetActive() {
  beerImages.forEach(img => img.classList.remove("active"));
  listItems.forEach(li => li.classList.remove("active"));
}

listItems.forEach(item => {
  const beerId = item.dataset.beer;
  const targetImg = document.getElementById(beerId);

  // Hover (Desktop)
  item.addEventListener("mouseenter", () => {
    resetActive();
    targetImg.classList.add("active");
    item.classList.add("active");
  });
  item.addEventListener("mouseleave", () => resetActive());

  // Click / Tap (Mobile)
  item.addEventListener("click", () => {
    if(targetImg.classList.contains("active")){
      targetImg.classList.remove("active");
      item.classList.remove("active");
    } else {
      resetActive();
      targetImg.classList.add("active");
      item.classList.add("active");
    }
  });
});

// --- Secret Easter Egg ---
const footer = document.getElementById("footer");
const secretImg = document.getElementById("secret");
const secretPass = "hopfenpower"; // Passwort

footer.addEventListener("click", () => {
  const input = prompt("Gib das geheime Bierwort ein:");
  if(input?.toLowerCase() === secretPass){
    secretImg.classList.add("show");
    setTimeout(() => secretImg.classList.remove("show"), 5000); // 5 Sekunden sichtbar
  } else {
    alert("Falsches Bierwort 😅");
  }
});

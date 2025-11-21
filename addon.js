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

// --- Secret Easter Egg + Disco Effekt ---
const footer = document.getElementById("footer");
const secretImg = document.getElementById("secret");
const secretPass = "danfred"; // Passwort
const body = document.body;

footer.addEventListener("click", () => {
  const input = prompt("Gib das geheime Bierwort ein (wie heisst Manfred's Bruder??):");
  if(input?.toLowerCase() === secretPass){
    // Secret Image anzeigen
    secretImg.classList.add("show");
    // Disco Effekt starten
    body.classList.add("disco");

    setTimeout(() => {
      secretImg.classList.remove("show");
      body.classList.remove("disco");
    }, 5000);
  } else {
    alert("Falsches Bierwort");
  }
});

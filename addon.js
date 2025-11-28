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

  item.addEventListener("mouseenter", () => {
    resetActive();
    targetImg.classList.add("active");
    item.classList.add("active");
  });

  item.addEventListener("mouseleave", () => resetActive());

  item.addEventListener("click", () => {
    if (targetImg.classList.contains("active")) {
      resetActive();
    } else {
      resetActive();
      targetImg.classList.add("active");
      item.classList.add("active");
    }
  });
});

// --- Geheimwort + Disco ---
const footer = document.getElementById("footer");
const secretImg = document.getElementById("secret");
const disco = document.getElementById("disco-overlay");

const secretPass = "Danfred";

footer.addEventListener("click", () => {
  const input = prompt("Gib das geheime Bierwort ein (wie heisst Manfred's Bruder??):");

  if (input?.toLowerCase() === secretPass) {

    secretImg.classList.add("show");
    disco.classList.add("active");

    setTimeout(() => {
      secretImg.classList.remove("show");
      disco.classList.remove("active");
    }, 5000);

  } else {
    alert("Falsches Bierwort");
  }
});

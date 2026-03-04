// ===== Purchase Button =====
const buyButton = document.getElementById("buy-button");

if (buyButton) {
  buyButton.addEventListener("click", () => {
    alert("Thank you for your purchase! (Still a troll site 🌿)");
  });
}

// ===== Leaf Particle Generator =====
function createLeaf() {
  const leaf = document.createElement("div");
  leaf.classList.add("leaf");

  // random starting position slightly off-screen for natural entry
  leaf.style.left = (Math.random() * (window.innerWidth + 100) - 50) + "px";
  // random size between 40px and 80px
  const size = 40 + Math.random() * 40;
  leaf.style.width = size + "px";
  leaf.style.height = size + "px";
  // random animation duration and a higher base opacity
  leaf.style.animationDuration = (6 + Math.random() * 6) + "s";
  leaf.style.opacity = 0.4 + Math.random() * 0.6;

  document.body.appendChild(leaf);

  setTimeout(() => {
    leaf.remove();
  }, 12000); // keep a slightly longer lifespan
}

// Spawn leaves every 800ms
setInterval(createLeaf, 800);

// ===== Scroll Reveal Animation =====
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

sections.forEach(section => {
  observer.observe(section);
});
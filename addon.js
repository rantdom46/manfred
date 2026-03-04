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

  leaf.style.left = Math.random() * window.innerWidth + "px";
  leaf.style.animationDuration = (5 + Math.random() * 5) + "s";
  leaf.style.opacity = Math.random();

  document.body.appendChild(leaf);

  setTimeout(() => {
    leaf.remove();
  }, 10000);
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
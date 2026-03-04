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

  // random horizontal start position
  leaf.style.left = Math.random() * window.innerWidth + "px";
  const size = 40 + Math.random() * 40;
  leaf.style.width = size + "px";
  leaf.style.height = size + "px";
  leaf.style.opacity = 0.4 + Math.random() * 0.6;

  // gentle fall animation lasting 8–14 seconds
  leaf.style.animation = `fall ${8 + Math.random() * 6}s linear forwards`;

  document.body.appendChild(leaf);

  // remove after animation roughly completes (plus a bit)
  setTimeout(() => {
    if (leaf.parentElement) leaf.remove();
  }, 16000);
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
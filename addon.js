// ===== Purchase Button =====
const buyButton = document.getElementById("buy-button");

if (buyButton) {
  buyButton.addEventListener("click", () => {
    alert("Thank you for your purchase! (Still a troll site 🌿)");
  });
}

// ===== Leaf Particle Generator (with simple physics) =====
const leaves = [];

function createLeaf() {
  const leaf = document.createElement("div");
  leaf.classList.add("leaf");

  // random horizontal start slightly off-screen
  const startX = Math.random() * (window.innerWidth + 100) - 50;
  const size = 40 + Math.random() * 40; // leaf size
  leaf.style.width = size + "px";
  leaf.style.height = size + "px";
  leaf.style.left = startX + "px";
  leaf.style.top = -size + "px";
  leaf.style.opacity = 0.4 + Math.random() * 0.6;

  document.body.appendChild(leaf);

  const data = {
    el: leaf,
    x: startX,
    y: -size,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 0,
    width: size,
    height: size,
    landed: false
  };

  // bounce/step when mouse enters
  leaf.addEventListener("mouseenter", () => {
    data.vy = -4;
    data.vx += (Math.random() - 0.5) * 4;
  });

  leaves.push(data);
}

function updateLeaves() {
  const gravity = 0.1;
  const scrollAccel = 0.5;

  leaves.forEach(d => {
    if (!d.landed) {
      d.vy += gravity;
      d.y += d.vy;
      d.x += d.vx;

      // wrap horizontally
      if (d.x < -d.width) d.x = window.innerWidth;
      if (d.x > window.innerWidth) d.x = -d.width;

      // land at bottom
      if (d.y >= window.innerHeight - d.height) {
        d.y = window.innerHeight - d.height;
        d.landed = true;
        d.vy = 0;
        // remove after a long time so they pile up
        setTimeout(() => {
          d.el.remove();
        }, 30000);
      }

      d.el.style.transform = `translate(${d.x}px, ${d.y}px)`;
    }
  });

  requestAnimationFrame(updateLeaves);
}

// increase gravity when user scrolls
window.addEventListener("scroll", () => {
  leaves.forEach(d => {
    if (!d.landed) {
      d.vy += scrollAccel;
    }
  });
});

updateLeaves();

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
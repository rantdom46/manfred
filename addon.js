// ===== Purchase Button =====
const buyButton = document.getElementById("buy-button");

if (buyButton) {
  buyButton.addEventListener("click", () => {
    alert("Thank you for your purchase! (Still a troll site 🌿)");
  });
}

// ===== Leaf Particle Generator =====
const landedLeaves = [];
const activeLeaves = [];
const allLeaves = [];

let lastMouseX = 0;
let lastMouseY = 0;
const dragState = {element: null, offsetX: 0, offsetY: 0};

// global mousemove for dragging only
document.addEventListener("mousemove", e => {
  // calculate movement deltas
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;

  if (dragState.element) {
    dragState.element.style.left = e.clientX - dragState.offsetX + "px";
    dragState.element.style.top = e.clientY - dragState.offsetY + "px";
  }

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

document.addEventListener("mouseup", () => {
  if (dragState.element) {
    dragState.element = null;
  }
});

function createLeaf() {
  const leaf = document.createElement("div");
  leaf.classList.add("leaf");

  const startX = Math.random() * (window.innerWidth + 100) - 50;
  const size = 40 + Math.random() * 40;
  leaf.style.width = size + "px";
  leaf.style.height = size + "px";
  leaf.style.left = startX + "px";
  leaf.style.top = "-" + size + "px";
  leaf.style.opacity = 0.4 + Math.random() * 0.6;

  // assign a random, slower fall duration so leaves drift gently
  leaf.style.animation = `fall ${8 + Math.random() * 6}s linear forwards`;

  document.body.appendChild(leaf);
  activeLeaves.push(leaf);
  allLeaves.push(leaf);

  // allow dragging
  leaf.addEventListener("mousedown", e => {
    dragState.element = leaf;
    const rect = leaf.getBoundingClientRect();
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    // stop animation when user grabs it
    leaf.style.animation = "";
  });

  // interaction: hover adds temporary class for scale
  leaf.addEventListener("mouseenter", () => leaf.classList.add("hovered"));
  leaf.addEventListener("mouseleave", () => leaf.classList.remove("hovered"));

  // when animation ends, mark as landed and keep in place
  leaf.addEventListener("animationend", () => {
    leaf.classList.add("landed");
    // remove from active list
    const idx = activeLeaves.indexOf(leaf);
    if (idx !== -1) activeLeaves.splice(idx, 1);
    // push onto pile array for possible later removal
    landedLeaves.push(leaf);
    // after a minute remove from DOM so pile doesn't grow forever
    setTimeout(() => {
      if (leaf.parentElement) leaf.remove();
      const idx2 = allLeaves.indexOf(leaf);
      if (idx2 !== -1) allLeaves.splice(idx2, 1);
    }, 60000);
  });

  // dragging end handler to resume fall if needed
  leaf.addEventListener("mouseup", () => {
    if (!leaf.classList.contains("landed")) {
      // restart animation from current position with short duration
      leaf.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
    }
  });
}
}

// add some permanent leaves at bottom
function createPermanentLeaves(count = 5) {
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf", "landed");
    const size = 40 + Math.random() * 40;
    leaf.style.width = size + "px";
    leaf.style.height = size + "px";
    leaf.style.left = Math.random() * (window.innerWidth - size) + "px";
    leaf.style.bottom = "0";
    leaf.style.opacity = 0.6;
    document.body.appendChild(leaf);
    allLeaves.push(leaf);
  }
}

// start things off
createPermanentLeaves(8);
setInterval(createLeaf, 800);

// scroll influences active leaves by speeding their drop
window.addEventListener("scroll", () => {
  activeLeaves.forEach(leaf => {
    // reduce remaining animation duration to ~1s so they fall quickly
    leaf.style.animationDuration = "1s";
  });
});

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
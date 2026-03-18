// ===== Booking helper (export-ready; backend may override) =====
let bookings = [];

function exportBookings() {
  return JSON.stringify(bookings, null, 2);
}

window.exportBookings = exportBookings;

// ===== Purchase/Booking Button =====
const buyButton = document.getElementById("buy-button");

if (buyButton) {
  buyButton.addEventListener("click", async () => {
    const name = (window.prompt("Enter your name for booking:", "") || "").trim();
    if (!name) {
      return alert("Name is required for booking.");
    }

    const start = window.prompt("Start date (YYYY-MM-DD):", "");
    if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) {
      return alert("Please enter a valid start date in YYYY-MM-DD format.");
    }

    const end = window.prompt("End date (YYYY-MM-DD):", "");
    if (!end || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
      return alert("Please enter a valid end date in YYYY-MM-DD format.");
    }

    if (new Date(start) > new Date(end)) {
      return alert("End date must be the same or after the start date.");
    }

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, startDate: start, endDate: end })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      bookings = data.bookings || bookings;
      alert(`Booked! ${name} from ${start} to ${end}. (Sent to Discord)`);
    } catch (error) {
      alert(`Booking error: ${error.message}`);
    }
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
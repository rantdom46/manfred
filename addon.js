// ===== Booking Form Submission =====
const bookingForm = document.getElementById("booking-form");
const bookingMessage = document.getElementById("booking-message");

if (bookingForm && bookingMessage) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("booking-name").value.trim();
    const startDate = document.getElementById("booking-start").value;
    const endDate = document.getElementById("booking-end").value;

    if (!name) {
      showMessage("Name is required", "error");
      return;
    }

    try {
      const response = await fetch("https://flip-dqnn.onrender.com/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, startDate, endDate })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      showMessage(`✅ Booked! ${name} from ${startDate} to ${endDate}. Check Discord! 🎲`, "success");
      bookingForm.reset();
    } catch (error) {
      console.error(error);
      showMessage(`❌ Error: ${error.message}`, "error");
    }
  });

  function showMessage(text, type) {
    bookingMessage.textContent = text;
    bookingMessage.className = `booking-message ${type}`;
    bookingMessage.style.display = "block";
    if (type === "success") {
      setTimeout(() => {
        bookingMessage.style.display = "none";
      }, 5000);
    }
  }
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
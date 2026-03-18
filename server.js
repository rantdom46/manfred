const express = require('express');
const path = require('path');
const fs = require('fs');
const { URL } = require('url');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DATA_FILE = path.join(__dirname, 'bookings.json');
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1483738743192944691/QHRXK6Ue0n2ig77_xro9eFrGaW9nfzSSYCkMtJuWzrEQdZ-LwQNqn7mYku-iLyMydh4U';

function readBookings() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || [];
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

function datesOverlap(aStart, aEnd, bStart, bEnd) {
  const start = new Date(aStart).getTime();
  const end = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return start <= bE && bS <= end;
}

async function sendDiscordNotification(booking) {
  const payload = {
    embeds: [
      {
        title: '🎲 New Flip Booking',
        color: 5814783,
        fields: [
          { name: 'Name', value: booking.name, inline: true },
          { name: 'From', value: booking.startDate, inline: true },
          { name: 'To', value: booking.endDate, inline: true }
        ],
        timestamp: booking.createdAt
      }
    ]
  };

  const res = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook failed: ${res.status} ${text}`);
  }
}

app.post('/api/book', async (req, res) => {
  const { name, startDate, endDate } = req.body || {};

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ message: 'Name, startDate, and endDate are required.' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return res.status(400).json({ message: 'Dates must be YYYY-MM-DD.' });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: 'End date must be equal or after start date.' });
  }

  const bookings = readBookings();
  const conflict = bookings.find(b => datesOverlap(b.startDate, b.endDate, startDate, endDate));
  if (conflict) {
    return res.status(409).json({ message: 'Timeframe conflict with an existing booking.' });
  }

  const newBooking = {
    id: Date.now(),
    name,
    startDate,
    endDate,
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeBookings(bookings);

  try {
    await sendDiscordNotification(newBooking);
  } catch (err) {
    console.error(err);
    // still allow booking success, return warning
    return res.status(201).json({ booking: newBooking, bookings, warning: err.message });
  }

  return res.status(201).json({ booking: newBooking, bookings });
});

app.get('/api/bookings', (req, res) => {
  res.json(readBookings());
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

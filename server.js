const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://anthonyzeitz5_db_user:9HimNQ0AXbZTwmMj@flipcluster.by5dlvr.mongodb.net/FlipDB?retryWrites=true&w=majority';
const DB_NAME = process.env.DB_NAME || 'FlipDB';
const COLLECTION_NAME = 'bookings';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1483738743192944691/QHRXK6Ue0n2ig77_xro9eFrGaW9nfzSSYCkMtJuWzrEQdZ-LwQNqn7mYku-iLyMydh4U';

let db;
const client = new MongoClient(MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    await collection.createIndex({ startDate: 1, endDate: 1 });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
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

  try {
    const collection = db.collection(COLLECTION_NAME);
    const bookings = await collection.find({}).toArray();
    const conflict = bookings.find(b => datesOverlap(b.startDate, b.endDate, startDate, endDate));
    if (conflict) {
      return res.status(409).json({ message: 'Timeframe conflict with an existing booking.' });
    }

    const newBooking = {
      name,
      startDate,
      endDate,
      createdAt: new Date().toISOString()
    };

    const result = await collection.insertOne(newBooking);
    newBooking._id = result.insertedId;

    try {
      await sendDiscordNotification(newBooking);
    } catch (err) {
      console.error('Discord error:', err);
      return res.status(201).json({ booking: newBooking, bookings, warning: err.message });
    }

    return res.status(201).json({ booking: newBooking, bookings });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const collection = db.collection(COLLECTION_NAME);
    const bookings = await collection.find({}).toArray();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
});


import express from 'express';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Google Analytics setup
const analytics = google.analytics('v4');
const VIEW_ID = process.env.GA_VIEW_ID;

async function getAnalyticsData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path/to/your/credentials.json',
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    const response = await analytics.data.realtime.get({
      auth,
      ids: `ga:${VIEW_ID}`,
      metrics: 'rt:activeUsers',
      dimensions: 'rt:pagePath'
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
}

// API endpoint for analytics data
app.get('/api/analytics', async (req, res) => {
  const data = await getAnalyticsData();
  res.json(data);
});

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
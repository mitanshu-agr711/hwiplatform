import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

// Enable CORS for the React app
app.use(cors({
  origin: 'http://localhost:5174'
}));

app.use(express.json());

// Serve fire data
app.get('/api/fires', (req, res) => {
  try {
    const fireDataPath = path.join(process.cwd(), 'src', 'fire_mock_data.json');
    const fireData = JSON.parse(fs.readFileSync(fireDataPath, 'utf8'));
    
    // Add some filtering options
    const { confidence, limit } = req.query;
    
    let fires = fireData.fires;
    
    // Filter by confidence if specified
    if (confidence) {
      fires = fires.filter(fire => fire.confidence === confidence);
    }
    
    // Limit results if specified
    if (limit) {
      fires = fires.slice(0, parseInt(limit));
    }
    
    res.json({
      ...fireData,
      fires,
      filtered: {
        total: fires.length,
        filters_applied: { confidence, limit }
      }
    });
  } catch (error) {
    console.error('Error serving fire data:', error);
    res.status(500).json({ error: 'Failed to load fire data' });
  }
});

// Serve fire statistics
app.get('/api/fires/stats', (req, res) => {
  try {
    const fireDataPath = path.join(process.cwd(), 'src', 'fire_mock_data.json');
    const fireData = JSON.parse(fs.readFileSync(fireDataPath, 'utf8'));
    
    res.json(fireData.statistics);
  } catch (error) {
    console.error('Error serving fire statistics:', error);
    res.status(500).json({ error: 'Failed to load fire statistics' });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Fire Data API server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   GET /api/fires - Get all fire data`);
  console.log(`   GET /api/fires?confidence=h - Get high confidence fires only`);
  console.log(`   GET /api/fires?limit=10 - Get first 10 fires`);
  console.log(`   GET /api/fires/stats - Get fire statistics`);
});
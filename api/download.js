import express from 'express';
import scdl from 'soundcloud-downloader';
import ytdl from '@distube/ytdl-core';

const app = express();
app.use(express.json());

// Main handler endpoint
app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    if (scdl.validateURL(url)) {
      // Handle SoundCloud
      const info = await scdl.getInfo(url);
      const title = info.title.replace(/[^\w\s]/gi, '') || 'soundcloud-track';
      
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
      res.setHeader('Content-Type', 'audio/mpeg');
      
      const stream = await scdl.download(url);
      return stream.pipe(res);

    } else if (ytdl.validateURL(url)) {
      // Handle YouTube
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '') || 'youtube-track';
      
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
      res.setHeader('Content-Type', 'audio/mpeg');

      // Download audio-only stream
      const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
      return stream.pipe(res);

    } else {
      return res.status(400).json({ error: 'Unsupported URL provider. Use YouTube or SoundCloud.' });
    }
  } catch (error) {
    console.error('Extraction Error:', error);
    return res.status(500).json({ error: 'Failed to process media stream. Please try again.' });
  }
});

// Export the app for Vercel's serverless environment
export default app;
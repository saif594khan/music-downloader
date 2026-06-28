const express = require('express');
const path = require('path');
const axios = require('axios');
const yolov = require('youtube-dl-exec');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

async function resolveShortUrl(url) {
  if (!url.includes('on.soundcloud.com')) return url;
  const response = await axios.head(url, { maxRedirects: 5 });
  return response.request.res.responseUrl || url;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const uniqueId = `web_${Date.now()}`;
  const tempOutputTemplate = `${uniqueId}_%(title)s.%(ext)s`;

  try {
    const fullSongUrl = await resolveShortUrl(url);
    let targetUrl = fullSongUrl;

    const cleanUrlObj = new URL(fullSongUrl);
    
    if (cleanUrlObj.hostname.includes('youtube.com') || cleanUrlObj.hostname.includes('youtu.be')) {
      // Extract ONLY the video ID parameter '?v=...' and drop all list/playlist ampersands
      const videoId = cleanUrlObj.searchParams.get('v');
      if (videoId) {
        targetUrl = `${cleanUrlObj.origin}${cleanUrlObj.pathname}?v=${videoId}`;
      }
    } else if (!fullSongUrl.includes('soundcloud.com')) {
      // General cleaning for other platforms
      targetUrl = `${cleanUrlObj.origin}${cleanUrlObj.pathname}`;
    }

    console.log(`📥 Web request received for: ${targetUrl}`);

    await yolov(targetUrl, {
      output: tempOutputTemplate, 
      extractAudio: true,
      audioFormat: 'mp3',
      noCheckCertificates: true,
      addMetadata: true,
      writeThumbnail: true,
      embedThumbnail: true,
      convertThumbnails: 'jpg'
    });

    const files = fs.readdirSync(__dirname);
    const downloadedFile = files.find(f => f.startsWith(uniqueId) && f.endsWith('.mp3'));

    if (downloadedFile) {
      const createdFilePath = path.join(__dirname, downloadedFile);
      const officialCleanName = downloadedFile.replace(`${uniqueId}_`, '');

      res.download(createdFilePath, officialCleanName, (err) => {
        if (fs.existsSync(createdFilePath)) fs.unlinkSync(createdFilePath);
        
        const cleanBase = downloadedFile.slice(0, -4);
        const thumbJpg = path.join(__dirname, `${cleanBase}.jpg`);
        const thumbWebp = path.join(__dirname, `${cleanBase}.webp`);
        if (fs.existsSync(thumbJpg)) fs.unlinkSync(thumbJpg);
        if (fs.existsSync(thumbWebp)) fs.unlinkSync(thumbWebp);
      });
    } else {
      throw new Error('Audio file matching template was not found.');
    }

  } catch (error) {
    console.error('❌ Web download failed detailed log:', error.message);
    res.status(500).json({ error: `Download failed: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Music Web App running at http://localhost:${PORT}`);
});
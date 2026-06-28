const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yolov = require('youtube-dl-exec');

const shortUrl = 'https://www.youtube.com/watch?v=4fDXcln1JpU'; 
const filename = 'perfect_track.mp3';

async function resolveShortUrl(url) {
  if (!url.includes('on.soundcloud.com')) return url;
  console.log('🔗 Resolving short mobile link...');
  const response = await axios.head(url, { maxRedirects: 5 });
  return response.request.res.responseUrl || url;
}

async function downloadTrack() {
  try {
    const fullSongUrl = await resolveShortUrl(shortUrl);
    let targetUrl = fullSongUrl;

    if (!fullSongUrl.includes('youtube.com') && !fullSongUrl.includes('youtu.be')) {
      const cleanUrlObj = new URL(fullSongUrl);
      targetUrl = `${cleanUrlObj.origin}${cleanUrlObj.pathname}`;
    }
    
    console.log(`✅ Clean track recognized: ${targetUrl}`);
    console.log('🎵 Extracting full track to mp3...');

    await yolov(targetUrl, {
      output: filename, 
      extractAudio: true,
      audioFormat: 'mp3',
      noCheckCertificates: true,
      addMetadata: true,
      
      // FIXED CAMELCASE PROPERTIES HERE:
      writeThumbnail: true,
      embedThumbnail: true
    });

    console.log('\n✅ SUCCESS! Your mp3 Song ALBUM IS DOWNLOADED.');
    console.log(`Check your sidebar for: ${filename}`);
    console.log('Open it up—your scroll bar and thumbnail will work perfectly!');

  } catch (error) {
    console.error('\n❌ Download pipeline failed:', error.message);
  }
}

downloadTrack();
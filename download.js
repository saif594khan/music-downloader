const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yolov = require('youtube-dl-exec');

// Paste your YouTube link safely here!
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

    // Only clean SoundCloud URLs. Leave YouTube links exactly as they are!
    if (!fullSongUrl.includes('youtube.com') && !fullSongUrl.includes('youtu.be')) {
      const cleanUrlObj = new URL(fullSongUrl);
      targetUrl = `${cleanUrlObj.origin}${cleanUrlObj.pathname}`;
    }
    
    console.log(`✅ Clean track recognized: ${targetUrl}`);
    console.log('🎵 Extracting full track, embedding thumbnail, and processing metadata...');

    await yolov(targetUrl, {
      output: filename, 
      extractAudio: true,
      audioFormat: 'mp3',
      noCheckCertificates: true,
      addMetadata: true,
      
      // --- ADDED FOR THUMBNAIL EMBEDDING ---
      writethumbnail: true,
      embedThumbnail: true
    });

    console.log('\n✅ SUCCESS! THE FULL SONG WITH ALBUM ART IS DOWNLOADED.');
    console.log(`Check your sidebar for: ${filename}`);
    console.log('Open it up—your scroll bar and thumbnail will work perfectly!');

  } catch (error) {
    console.error('\n❌ Download pipeline failed:', error.message);
  }
}

downloadTrack();
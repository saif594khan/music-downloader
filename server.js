const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yolov = require('youtube-dl-exec');

// 🔗 Swap this link for whichever video you want to grab!
const shortUrl = 'https://www.youtube.com/watch?v=WgGV5EE-8Co'; 

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
    console.log('🎵 Fetching track title, extracting audio, and embedding artwork...');

    // Execute and save right here in the local project folder
    await yolov(targetUrl, {
      output: '%(title)s.%(ext)s', // 💡 Saves using the real video title
      extractAudio: true,
      audioFormat: 'mp3',
      noCheckCertificates: true,
      addMetadata: true,
      embedThumbnail: true         // 💡 Embeds internal artwork without leaving extra image files
    });

    console.log('\n✅ SUCCESS! THE TRACK IS DOWNLOADED.');
    console.log('Check your project sidebar for the dynamic MP3 file!');

  } catch (error) {
    console.error('\n❌ Download pipeline failed:', error.message);
  }
}

downloadTrack();
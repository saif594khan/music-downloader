const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ text: 'Method Not Allowed' });
    }

    try {
        const { url } = req.body;

        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).json({ status: 'error', text: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

        if (!audioFormat || !audioFormat.url) {
            return res.status(404).json({ status: 'error', text: 'Audio format not found' });
        }

        return res.status(200).json({ 
            status: 'redirect', 
            url: audioFormat.url 
        });

    } catch (error) {
        return res.status(500).json({ status: 'error', text: error.message });
    }
};
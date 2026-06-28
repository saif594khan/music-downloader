const ytdl = require('@distube/ytdl-core');

// Aapki YouTube Cookies ka array jo aapne provide kiya hai
const cookies = [
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.322378,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-1PAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "PGHGqO_rr0gzaH3v/AkzFDhxlPl5i8l89O",
    "id": 1
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.323976,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a000_AhC-uPeHW4i4MrEfvPhl53rztFUBYmNX47TzCVDA5C1xhp9Ii_HqFR31EC7SBPYowhGKQACgYKAasSARISFQHGX2MiswhgvtGnQ2Z0ckZw3XGoYRoVAUF8yKpmyqmwOCCAO56oFGxNYruo0076",
    "id": 2
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1814166199.797036,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzVXIDBX9GqMAwtIcDwS29ZZQHVBHZPs0Gw3P3d5qORCHt1xJ_TEgzeLZApMGJdNwhT3Yxo",
    "id": 3
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1814166199.795169,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDTS",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjQByojQU484GV-LW9kIeoZD4-jlmD_sHsCBSMU_tDntMaigHpEpNfoVG5AuFVmnYhcfedLgEAA",
    "id": 4
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.322478,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-3PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "PGHGqO_rr0gzaH3v/AkzFDhxlPl5i8l89O",
    "id": 5
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.324204,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a000_AhC-uPeHW4i4MrEfvPhl53rztFUBYmNX47TzCVDA5C1xhp9ZJUNpUdl1velUyL8qE3XuQACgYKAYwSARISFQHGX2MiHCcheawOXoB1wLkFNuioWBoVAUF8yKpWW-y8NwPbSmv1J-Ga1h0F0076",
    "id": 6
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1814166199.797391,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzWbvA_LuzeeudYuYTBJmtaPPvQfk4V_Hbg3JtXJB87OmQoVdYzdM74uBbWu_M5FDtO_dA",
    "id": 7
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1814166199.795999,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjQByojQU484GV-LW9kIeoZD4-jlmD_sHsCBSMU_tDntMaigHpEpNfoVG5AuFVmnYhcfedLgEAA",
    "id": 8
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1791195616.718813,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-BUCKET",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "CJQE",
    "id": 9
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.322082,
    "hostOnly": false,
    "httpOnly": false,
    "name": "APISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "bTo86iWKLHuuCZ3f/A__U6dUgI_t88hTd8",
    "id": 10
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.321639,
    "hostOnly": false,
    "httpOnly": true,
    "name": "HSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "ALsVU7lB_get-9uLW",
    "id": 11
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1807107879.915783,
    "hostOnly": false,
    "httpOnly": true,
    "name": "LOGIN_INFO",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AFmmF2swRAIgaKyRn_i8DcPxwFP5AWYLpd-p3euJNKcEDttYceUJrkUCIGcUDpZh8DSzxj_poMh-LmI98WXv3vvUkyYk5CURg0I1:QUQ3MjNmeVdmY0l2NC04UUlFVFo2b19PSTNFUWlGRGd6UU10dTZ4cmMzV3N3T0REa1cteWhKVWg0X2tWZUFhcDg1LTlReUZEQ3dsTjVZVndiLWtOOHpqRXdveTJEX01OcDRqU2RuRFVRMF85cnZZRW53UzNvb1lkX2RMZzJ2N2c4UXA3TFYwMHI5OWtKMkJUYTU4WnktZXRrZVBhUUhmZUdn",
    "id": 12
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1798401273.716673,
    "hostOnly": false,
    "httpOnly": true,
    "name": "NID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "532=uZXuFjTfyixz6oq2Y1FLV3yWH-uDrs8aCs48jF9WGEBYw8EPxyzuYBLONMCKlm0XwqIvWFe0Tfcsbmwmg4rK22ytVagK2rqVdILuFIyZhw56lUQBNPLl5HX5Fa303QniJgWA0hI6YKJwmcyz0kwdDjMnbWBa5EBo6fCBE1376vkTzZyA1Q2KnNBP9ejsgXwvKMkyb-Is2JeZ3UEr5yGY24SNluiklnY",
    "id": 13
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1817189384.43548,
    "hostOnly": false,
    "httpOnly": false,
    "name": "PREF",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "tz=Asia.Karachi&f6=40000000&f5=30000&f7=100&f4=4010000",
    "id": 14
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.322269,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "PGHGqO_rr0gzaH3v/AkzFDhxlPl5i8l89O",
    "id": 15
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.323778,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "g.a000_AhC-uPeHW4i4MrEfvPhl53rztFUBYmNX47TzCVDA5C1xhp9a6mkRTDBicogOShYdIhtcAACgYKAWQSARISFQHGX2MiuME1wRTBLIWWmDbg-H0m1xoVAUF8yKq_VjA1eAwfauLtTKBn7Ist0076",
    "id": 16
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1814166199.796639,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzXwHdS_8l1NptZELRbePkzqQbMyxF6mvtCK096nhzSI0ic9MVnc-5fXPKyBjwo9ITqWckU",
    "id": 17
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1815906718.321913,
    "hostOnly": false,
    "httpOnly": true,
    "name": "SSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "Azf-21q_qjRUrplyk",
    "id": 18
  }
];

// Cookies ka use karte hue authorized agent create karna
const agent = ytdl.createAgent(cookies);

module.exports = async (req, res) => {
    // CORS Headers setup
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

        // Agent object ko options me pass karna taake YouTube request authorize ho sake
        const info = await ytdl.getInfo(url, { agent });
        
        // Highest audio format filter karna
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
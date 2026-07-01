const express = require("express");
const axios = require("axios");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8080;

const ytDlpPath = path.join(__dirname, "node_modules", "youtube-dl-exec", "bin", "yt-dlp.exe");

// Desktop browser client profile simulation data
const REAL_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function sanitizeFilename(filename) {
  return filename.replace(/[\\/:*?"<>|@]/g, "").trim();
}

function getOriginalTitle(targetUrl) {
  return new Promise((resolve) => {
    // FIX 1: Added browser impersonation to avoid scraping flags during title extraction
    const process = spawn(ytDlpPath, [
      targetUrl, 
      "--get-title", 
      "--no-playlist",
      "--user-agent", REAL_USER_AGENT,
      "--impersonate", "chrome"
    ]);
    let title = "";

    process.stdout.on("data", (data) => {
      title += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0 && title.trim()) {
        resolve(sanitizeFilename(title.trim()));
      } else {
        resolve(`song_${Date.now()}`);
      }
    });
  });
}

app.post("/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const uniqueId = Date.now();
  const rawDownloadTemplate = path.join(__dirname, `raw_${uniqueId}.%(ext)s`);
  const finalMp3Path = path.join(__dirname, `music_${uniqueId}.mp3`);

  try {
    let targetUrl = url.trim();

    console.log(`Processing track securely: ${targetUrl}`);

    const originalTitle = await getOriginalTitle(targetUrl);
    console.log(`Targeting filename: ${originalTitle}`);

    // FIX 2: Dynamic referer mapping + full chrome client impersonation pipeline
    const isSoundCloud = targetUrl.includes("soundcloud.com");
    const ytDlpArgs = [
      targetUrl,
      "--output", rawDownloadTemplate,
      "--no-playlist",
      "--no-check-certificates",
      "--add-metadata",
      "--write-thumbnail",
      "--format", "ba",
      "--retries", "infinite",
      "--fragment-retries", "infinite",
      "--user-agent", REAL_USER_AGENT,
      "--impersonate", "chrome",
      "--referer", isSoundCloud ? "https://soundcloud.com/" : "https://www.youtube.com/"
    ];

    await new Promise((resolve, reject) => {
      const ls = spawn(ytDlpPath, ytDlpArgs, { windowsVerbatimArguments: false });

      let stderrData = "";
      ls.stdout.on("data", (data) => console.log(`yt-dlp: ${data.toString().trim()}`));
      ls.stderr.on("data", (data) => { stderrData += data.toString(); });

      ls.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderrData || `yt-dlp exited with code ${code}`));
      });
    });

    const files = fs.readdirSync(__dirname);
    const rawFile = files.find(
      (f) => f.startsWith(`raw_${uniqueId}.`) && !f.endsWith(".webp") && !f.endsWith(".jpg") && !f.endsWith(".png")
    );
    const webpFile = files.find(
      (f) => f.startsWith(`raw_${uniqueId}.`) && (f.endsWith(".webp") || f.endsWith(".jpg") || f.endsWith(".png"))
    );

    if (!rawFile) {
      throw new Error("Could not find the downloaded source track.");
    }

    const fullRawPath = path.join(__dirname, rawFile);
    let ffCommand = ffmpeg(fullRawPath);
    let fullThumbnailPath = "";

    if (webpFile) {
      fullThumbnailPath = path.join(__dirname, webpFile);
      ffCommand = ffCommand
        .input(fullThumbnailPath)
        .outputOptions([
          "-map", "0:0",
          "-map", "1:0",
          "-id3v2_version", "3",
          "-metadata:s:v", "title=Cover",
          "-metadata:s:v", "comment=Cover"
        ]);
    }

    ffCommand
      .toFormat("mp3")
      .audioBitrate(192)
      .on("end", () => {
        console.log(`Audio transcode complete: music_${uniqueId}.mp3`);

        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(originalTitle)}.mp3"`);
        
        res.download(finalMp3Path, `${originalTitle}.mp3`, (err) => {
          if (fs.existsSync(finalMp3Path)) fs.unlinkSync(finalMp3Path);
          if (fs.existsSync(fullRawPath)) fs.unlinkSync(fullRawPath);
          if (fullThumbnailPath && fs.existsSync(fullThumbnailPath)) fs.unlinkSync(fullThumbnailPath);
        });
      })
      .on("error", (err) => {
        console.error("FFmpeg conversion error:", err.message);
        if (fs.existsSync(fullRawPath)) fs.unlinkSync(fullRawPath);
        if (fullThumbnailPath && fs.existsSync(fullThumbnailPath)) fs.unlinkSync(fullThumbnailPath);
        res.status(500).json({ error: "Conversion failed", details: err.message });
      })
      .save(finalMp3Path);

  } catch (error) {
    console.error("--- PIPELINE CRITICAL ERROR ---");
    console.error(error.message || error);
    console.error("--------------------------------");

    res.status(500).json({
      error: "Download or conversion failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Live Server running locally on port ${PORT}`);
});
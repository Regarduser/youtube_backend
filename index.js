const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/info", (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "Missing URL" });
    }

    console.log(`👉 Received URL: ${url}`);

    const command = `yt-dlp -j -f "bestaudio+bestvideo/best" --cookies cookies.txt ${url}`;
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error fetching video info: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }

    if (stderr) {
        console.warn(`⚠️ Warning: ${stderr}`);
    }

    try {
        const info = JSON.parse(stdout);

        const data = {
            id: info.id,
            title: info.title,
            url: `https://www.youtube.com/embed/${info.id}`,
            formats: info.formats
                .filter((format) => format.url) 
                .filter((format) => !format.url.endsWith(".m3u8"))
                .map((format) => ({
                    url: format.url,
                    mimeType: format.mime_type,
                    quality: format.format_note,
                    resolution: format.resolution,
                    hasVideo: format.vcodec !== "none",
                    hasAudio: format.acodec !== "none",
                }))
                .filter((format) => format.hasAudio && format.hasVideo), // Keep at least audio or video
        };

        return res.json(data);
    } catch (parseError) {
        console.error(`❌ Error parsing video info: ${parseError.message}`);
        return res.status(500).json({ error: "Failed to parse video info" });
    }
});


});

app.listen(PORT, () => {
    console.log(`✅ Server is running on PORT: ${PORT}`);
});

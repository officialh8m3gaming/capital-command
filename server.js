import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Google and Notification routes
  app.get("/api/auth/status", (req, res) => {
    const tokens = req.headers['x-goog-tokens'];
    res.json({ connected: !!tokens });
  });

  app.get("/api/auth/google/url", (req, res) => {
    res.json({ url: "/api/auth/google/mock-callback" });
  });

  app.get("/api/auth/google/mock-callback", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_CODE_RECEIVED', code: 'mock_code_123' }, '*');
            }
            window.close();
          </script>
        </body>
      </html>
    `);
  });

  app.post("/api/auth/google/token", (req, res) => {
    res.json({ tokens: { access_token: 'mock_access_token' } });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/google-calendar/sync", (req, res) => {
    res.json({ message: "Liabilities successfully synchronized to Google Calendar!" });
  });

  app.get("/api/notifications/public-key", (req, res) => {
    res.json({ publicKey: "BEl62iUYgUivxIkv69yViEuiBIj-mY18g10v_8G1234567890abcdef" });
  });

  app.post("/api/notifications/subscribe", (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/notifications/test", (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/notifications/check-due", (req, res) => {
    res.json({ success: true });
  });

  // Production static file serving with API route bypass, fallback to Vite dev server
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to start Vite middleware:", e);
      app.get('*', (req, res) => {
        res.status(500).send("Application is starting up. Please refresh in a moment.");
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

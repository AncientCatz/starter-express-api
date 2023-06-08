const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; // Choose a port number

// Middleware to log request details and forward to Discord webhook
app.use((req, res, next) => {
  if (req.path === '/favicon.ico') {
    next();
    return;
  }

  const logMessage = `
    Request path: ${req.path}
    Query parameters: ${JSON.stringify(req.query)}
    Full request URL: ${req.originalUrl}
    Request method: ${req.method}
  `;

  sendLogToDiscordWebhook(logMessage)
    .then(() => next())
    .catch((error) => {
      console.error('Error sending log to Discord webhook:', error);
      next();
    });
});

// Function to send log to Discord webhook
async function sendLogToDiscordWebhook(logMessage) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const payload = {
      content: 'New log entry:',
      embeds: [
        {
          description: logMessage,
          color: 16711680, // Red color
        },
      ],
    };
    await axios.post(webhookUrl, payload);
  } catch (error) {
    throw error;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

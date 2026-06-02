const { serveNcmApi } = require('NeteaseCloudMusicApi');

async function startServer() {
  try {
    const server = await serveNcmApi({
      port: 3000,
      host: '0.0.0.0',
    });
    console.log('Netease Cloud Music API started on port 3000');
  } catch (error) {
    console.error('Failed to start Netease API:', error);
  }
}

startServer();

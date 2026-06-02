const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/song/url/v1', { id: 2747166493, level: 'exhigh' });
    console.log('URL:', res.data.data[0].url);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
test();

const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/playlist/track/all', { id: 17932002922, limit: 100 });
    console.log('Tracks length:', res.data.songs?.length);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
test();

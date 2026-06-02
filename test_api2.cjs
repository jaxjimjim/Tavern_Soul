const axios = require('axios');
async function test() {
  try {
    const res1 = await axios.get('http://localhost:3000/top/playlist?limit=1');
    const plId = res1.data.playlists[0].id;
    console.log('Playlist ID:', plId);
    
    const res2 = await axios.get(`http://localhost:3000/playlist/track/all?id=${plId}&limit=5`);
    console.log('Tracks type:', typeof res2.data.songs, Array.isArray(res2.data.songs));
    if (res2.data.songs) {
      console.log('First track name:', res2.data.songs[0].name);
      console.log('First track id:', res2.data.songs[0].id);
    } else {
      console.log('Keys in res.data:', Object.keys(res2.data));
    }
  } catch (e) {
    console.error(e.message);
  }
}
test();

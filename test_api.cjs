const axios = require('axios');
async function test() {
  try {
    const res1 = await axios.get('http://localhost:3000/search?keywords=海阔天空');
    const songId = res1.data.result.songs[0].id;
    console.log('Song ID:', songId);
    
    const res2 = await axios.get(`http://localhost:3000/song/url/v1?id=${songId}&level=exhigh`);
    console.log('Song URL res:', res2.data.data[0].url);
  } catch (e) {
    console.error(e.message);
  }
}
test();

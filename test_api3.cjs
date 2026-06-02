const axios = require('axios');
async function test() {
  const res = await axios.get('http://localhost:3000/playlist/track/all?id=17932002922&limit=1');
  console.log(res.data.songs[0].al.picUrl);
}
test();

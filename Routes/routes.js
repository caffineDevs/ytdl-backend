const router = require("express").Router();
const ytdl = require("ytdl-core");

router.post("/", async (req, res) => {
  let info = await ytdl.getInfo(req.body.url);
  // console.log(info.formats)
  res.send(info.formats);
});

module.exports = router;

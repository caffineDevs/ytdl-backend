const router = require("express").Router();
const ytdl = require("ytdl-core");
const axios = require("axios");
const fs = require('fs');
var cors = require('cors');

let filename;



router.post("/", async (req, res) => {
  let info = await ytdl.getInfo(req.body.url);
  filename = regxFilenameForUbuntu(info.videoDetails.title);
  res.send(info);
});

router.post("/download", cors(), async (req, res) => {
  let filePath = `./outfile.${req.body.extension}`;
  const options = {
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'content-disposition': "attachment; filename=" + filename, // gets ignored
        'content-type': "video/mp4"
    }
}

  downloadFile(req.body.url, filePath).then((data) => {
    res.download(filePath, filename, options, function (err) {
      fs.unlink(filePath, function () {
        console.log("File was deleted");
      });
    });
  });
});

module.exports = router;

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  }).then((response) => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}

function regxFilenameForUbuntu(name) {
  return name.replace(/[^a-zA-Z0-9 ]/g, "_");
}

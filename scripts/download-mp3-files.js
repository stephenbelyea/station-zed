const fs = require("fs");
const request = require("request");
const { getAllFeedItems } = require("./parse-xml-feeds");

const downloadAndRenameEpisode = async ({ id, fileUrl, showId }) => {
  const episodeName = `${showId}-${id}`;
  const mp3File = fs
    .createWriteStream(`${__dirname}/mp3-files/${showId}/${episodeName}.mp3`)
    .on("finish", () => {
      console.log("Finished writing: ", episodeName);
      mp3File.close();
    });

  return new Promise((resolve, reject) =>
    request
      .get(fileUrl)
      .on("error", reject)
      .on("response", resolve)
      .pipe(mp3File)
  );
};

const downloadAndRenameMp3Files = async () => {
  const allItems = getAllFeedItems();
  const totalToDownload = allItems.length;
  for (let i = 0; i < totalToDownload; i++) {
    await new Promise(async (resolve) =>
      setTimeout(async () => {
        await downloadAndRenameEpisode(allItems[i]);
        return resolve();
      }, 500)
    );
  }
};

// Don't use this one unless you know what you're doing...
downloadAndRenameMp3Files();

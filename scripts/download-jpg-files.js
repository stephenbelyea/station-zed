const fs = require("fs");
const request = require("request");
const { getAllFeedItems } = require("./parse-xml-feeds");
const { getImageFromContent } = require("./parse-json-feeds");

const downloadAndRenameImage = async ({ showId, content }) => {
  const image = getImageFromContent(content);

  if (!image || !image.name || !image.url) {
    return new Promise((resolve) => resolve());
  }

  const imageFile = fs
    .createWriteStream(`${__dirname}/jpg-files/${showId}/${image.name}`)
    .on("finish", () => {
      console.log("Finished writing: ", image.name);
      imageFile.close();
    });

  return new Promise((resolve, reject) =>
    request
      .get(image.url)
      .on("error", reject)
      .on("response", resolve)
      .pipe(imageFile)
  );
};

const downloadAndRenameJpgFiles = async () => {
  const allItems = getAllFeedItems();
  const totalToDownload = allItems.length;
  for (let i = 0; i < totalToDownload; i++) {
    await new Promise(async (resolve) =>
      setTimeout(async () => {
        await downloadAndRenameImage(allItems[i]);
        return resolve();
      }, 500)
    );
  }
};

// Don't use this one unless you know what you're doing...
downloadAndRenameJpgFiles();

const fs = require("fs");
const { getAllFeedItems } = require("./parse-xml-feeds");

const allItems = getAllFeedItems();

const writeFilemapFile = (fileName, json) => {
  fs.writeFile(`${__dirname}/filemaps/${fileName}.json`, json, (err) => {
    if (err) {
      console.error("Error! ", err);
    } else {
      console.log("Successful! ", fileName);
    }
  });
};

const createJpgFilemap = () => {
  const fileMap = JSON.stringify({
    files: allItems.map(({ showId, id }) => ({
      showId: showId,
      episodeId: id,
      fileId: "",
      fileType: "image/jpeg",
    })),
  });
  writeFilemapFile("jpg-filemap", fileMap);
};

const createMp3Filemap = () => {
  const fileMap = JSON.stringify({
    files: allItems.map(({ showId, id }) => ({
      showId: showId,
      episodeId: id,
      fileId: "",
      fileType: "audio/mpeg",
    })),
  });
  writeFilemapFile("mp3-filemap", fileMap);
};

const createFileNameMap = () => {
  const fileMap = JSON.stringify({
    fileNames: allItems.map(({ showId, id }) => `${showId}-${id}`),
  });
  writeFilemapFile("file-name-map", fileMap);
};

createMp3Filemap();
createJpgFilemap();
createFileNameMap();

const fs = require("fs");
const { getAllFeedItems, IDS } = require("./parse-xml-feeds");

const readSharedFiles = (showId) =>
  JSON.parse(
    fs.readFileSync(`${__dirname}/shared/${showId}-files.json`, "utf8")
  ).files;

const allSharedFiles = [
  ...readSharedFiles(IDS.THE_DUST_OFF),
  ...readSharedFiles(IDS.SPRINGFIELD_THE_LATER_YEARS),
  ...readSharedFiles(IDS.BOOZING_AND_BONDING),
  ...readSharedFiles(IDS.WRESTLE_DADDIES),
];

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

const getSharedIdForFile = (fileId) => {
  const sharedFile = allSharedFiles.find((file) => file.episodeId === fileId);
  return sharedFile ? sharedFile.sharedId : "";
};

const createMp3Filemap = () => {
  const fileMap = JSON.stringify({
    files: allItems.map(({ showId, id }) => ({
      showId: showId,
      episodeId: id,
      fileId: getSharedIdForFile(`${showId}-${id}`),
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

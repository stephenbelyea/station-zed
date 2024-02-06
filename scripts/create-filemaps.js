const fs = require("fs");
const { parse } = require("node-html-parser");
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

const getImageFromContent = (content) => {
  const parsedContent = parse(content);
  if (!parsedContent) return null;

  const images = parsedContent.querySelectorAll("img");
  if (images.length === 0) return null;

  const url = images[0].getAttribute("src");
  const urlParts = url.split("/");

  return {
    url,
    name: urlParts.slice(-1)[0],
  };
};

const createJpgFilemap = () => {
  const fileMap = JSON.stringify({
    files: allItems.map(({ showId, id: episodeId, content }) => {
      let fileId = "";
      switch (showId) {
        case "the-dust-off":
          fileId = `${showId}-${episodeId}.jpg`;
          break;
        case "wrestle-daddies":
        fileId = `${showId}.png`;
          break;
        default:
        const image = getImageFromContent(content);
        if (image && image.name) {
          fileId = image.name;
        }
          break;
      }
      return {
        showId,
        episodeId,
        fileId,
      };
    }),
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

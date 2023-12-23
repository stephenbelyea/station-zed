const episodesElem = document.getElementById("episodes");

window.StationZed = {
  lastLinkHash: "",
  showId: episodesElem.getAttribute("data-show-id"),
  feedId: episodesElem.getAttribute("data-feed-id"),
};

const getShowFeed = async () => {
  try {
    const response = await fetch(`./data/${window.StationZed.feedId}.json`);
    return await response.json();
  } catch (err) {
    console.log("Error!", err);
    return null;
  }
};

const getFilemap = async (fileType) => {
  try {
    const response = await fetch(`./data/${fileType}-filemap.json`);
    const { files } = await response.json();
    return {
      files: files.filter((file) => file.showId === window.StationZed.showId),
    };
  } catch (err) {
    console.log("Error!", err);
    return null;
  }
};

window.StationZed.showFeed = new Promise(async (resolve, reject) => {
  const showFeed = await getShowFeed();
  if (showFeed) return resolve(showFeed);
  else return reject();
});

window.StationZed.mp3Filemap = new Promise(async (resolve, reject) => {
  const mp3Filemap = await getFilemap("mp3");
  if (mp3Filemap) return resolve(mp3Filemap);
  else return reject();
});

window.StationZed.jpgFilemap = new Promise(async (resolve, reject) => {
  const jpgFilemap = await getFilemap("jpg");
  if (jpgFilemap) return resolve(jpgFilemap);
  else return reject();
});

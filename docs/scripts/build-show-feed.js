const episodesElem = document.getElementById("episodes");

const feedId = episodesElem.getAttribute("data-feed-id");
const showId = episodesElem.getAttribute("data-show-id");

const summaryLength = 250;

let showFiles = [];

const templateEpisodeMp3File = (id) => {
  const episodeFile = showFiles.find((file) => file.episodeId === id);

  if (!episodeFile)
    return '<img src="icons/headset.svg" alt="" /> File not available';

  const downloadLink = `https://drive.google.com/u/0/uc?id=${episodeFile.fileId}&export=download`;

  return [
    `<img src="icons/download.svg" alt="" /> `,
    `<a href="${downloadLink}" aria-describedby="${id}-title">`,
    `Download file`,
    `</a>`,
  ].join("");
};

const templateEpisodeSummary = (rawSummary) => {
  const summary = rawSummary.replaceAll("â", "'").replaceAll("Â", "");
  return summary.length > summaryLength
    ? summary.substring(0, summaryLength).trim() + "..."
    : summary;
};

const templateEpisode = ({ id, imageUrl, title, date, duration, summary }) => `
<article class="episode" id="${id}">
  ${imageUrl ? `<img class="episode-img" src="${imageUrl}" alt="" />` : ""}
  <div class="episode-body">
    <h3 id="${id}-title">
      <a href="#${id}" class="view-episode-link">${title}</a>
    </h3>
    <ul class="meta">
      <li><img src="icons/calendar.svg" alt="Release date" /> ${date}</li>
      <li><img src="icons/timer.svg" alt="Episode length" /> ${duration}</li>
      <li>${templateEpisodeMp3File(id)}</li>
    </ul>
    <p>${templateEpisodeSummary(summary)}</p>
  </div>
</article>
`;

const getShowFeed = async () => {
  try {
    const response = await fetch(`./data/${feedId}.json`);
    return await response.json();
  } catch (err) {
    console.log("Error!", err);
    return null;
  }
};

const getMp3Filemap = async () => {
  try {
    const response = await fetch(`./data/mp3-filemap.json`);
    return await response.json();
  } catch (err) {
    console.log("Error!", err);
    return null;
  }
};

const buildShowFeed = async () => {
  const { episodes } = await getShowFeed();
  const { files } = await getMp3Filemap();
  showFiles = files.filter((file) => file.showId === showId);

  const episodesHtml = episodes.map(templateEpisode);
  episodesElem.innerHTML = episodesHtml.join("");
};

buildShowFeed();

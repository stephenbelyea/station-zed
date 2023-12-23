const { files: mp3Files } = await window.StationZed.mp3Filemap;
const summaryLength = 250;

const templateEpisodeMp3File = (id) => {
  const episodeFile = mp3Files.find((file) => file.episodeId === id);

  if (!episodeFile || !episodeFile.fileId)
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

const buildShowFeed = async () => {
  const { episodes } = await window.StationZed.showFeed;
  const episodesHtml = episodes.map(templateEpisode);
  document.getElementById("episodes").innerHTML = episodesHtml.join("");
};

buildShowFeed();

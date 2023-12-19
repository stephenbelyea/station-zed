const episodesElem = document.getElementById("episodes");

const feedId = episodesElem.getAttribute("data-feed-id");
const showId = episodesElem.getAttribute("data-show-id");

const summaryLength = 250;

const templateEpisode = ({
  id,
  imageUrl,
  title,
  date,
  duration,
  fileUrl,
  summary,
}) => `
<article class="episode" id="${id}">
  ${imageUrl ? `<img class="episode-img" src="${imageUrl}" alt="" />` : ""}
  <div class="episode-body">
    <h3 id="${id}-title">
      <a href="#${id}">${title}</a>
    </h3>
    <ul class="meta">
      <li>${date}</li>
      <li>${duration}</li>
      <li>${
        fileUrl
          ? `<a href="${fileUrl}" aria-describedby="${id}-title">Download</a>`
          : "File not available"
      }</li>
    </ul>
    <p>${
      summary.length > summaryLength
        ? summary.substring(0, summaryLength).trim() + "..."
        : summary
    }</p>
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

const buildShowFeed = async () => {
  const { episodes } = await getShowFeed();
  const episodesHtml = episodes.map(templateEpisode);
  episodesElem.innerHTML = episodesHtml.join("");
};

buildShowFeed();

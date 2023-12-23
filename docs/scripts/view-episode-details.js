const modalOverlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");
const sections = document.getElementsByTagName("section");
const episodes = document.getElementById("episodes");
const episodeLinks = document.getElementsByClassName("view-episode-link");

const feedId = episodes.getAttribute("data-feed-id");
const showId = episodes.getAttribute("data-show-id");

const backLinkHash = "#back";
let lastLinkHash = "";

const getFileDownloadLink = (fileId) =>
  `https://drive.google.com/u/0/uc?id=${fileId}&export=download`;

const templateEpisodeAudioPlayer = (episodeFile) => {
  if (!episodeFile) return "";
  const { fileId, fileType } = episodeFile;
  return [
    `<audio controls preload="metadata">`,
    `<source src="${getFileDownloadLink(fileId)}" type="${fileType}" />`,
    `</audio>`,
  ];
};

const templateEpisodeMp3File = (id, episodeFile) => {
  if (!episodeFile)
    return '<img src="icons/headset.svg" alt="" /> File not available';
  const { fileId } = episodeFile;
  return [
    `<img src="icons/download.svg" alt="" /> `,
    `<a href="${getFileDownloadLink(fileId)}" aria-describedby="${id}-title">`,
    `Download file`,
    `</a>`,
  ].join("");
};

const templateEpisodeContent = (rawContent, rawKeywords) => {
  const content = rawContent.replaceAll("h3", "h4").replaceAll("h2", "h3");
  const keywords = rawKeywords.split(",").join(", ");
  return [
    `<div class="episode-content">`,
    content,
    `<p class="keywords"><strong>Keywords:</strong> `,
    keywords,
    `.</p></div>`,
  ].join("");
};

const templateEpisodeDetails = (
  { id, title, date, duration, imageUrl, content, keywords },
  episodeFile
) => `
  <div class="modal-banner">
    <img src="${imageUrl}" alt="" />
    ${templateEpisodeAudioPlayer(episodeFile)}
  </div>
  <div class="modal-body">
    <h2 id="${id}-title">${title}</h2>
    <ul class="meta">
      <li><img src="icons/calendar.svg" alt="Release date" /> ${date}</li>
      <li><img src="icons/timer.svg" alt="Episode length" /> ${duration}</li>
      <li>${templateEpisodeMp3File(id, episodeFile)}</li>
    </ul>
    ${templateEpisodeContent(content, keywords)}
    <p class="back-to-episodes">
      <a href="${backLinkHash}">Back to episodes list</a>
    </p>
  </div>
`;

const toggleSectionsAriaHidden = (ariaHidden = "false") => {
  for (let i = 0; i < sections.length; i++) {
    sections[i].setAttribute("aria-hidden", ariaHidden);
  }
};

const toggleEpisodeDetailsModal = (episode = null, episodeFile) => {
  if (episode) {
    modal.innerHTML = templateEpisodeDetails(episode, episodeFile);
    modal.setAttribute("aria-modal", "true");
    modalOverlay.setAttribute("aria-hidden", "false");
    toggleSectionsAriaHidden("true");
    document.body.classList.add("view-episode");
    modal.focus();
  } else {
    document.body.classList.remove("view-episode");
    modalOverlay.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    toggleSectionsAriaHidden();
    modal.innerHTML = "";
    if (lastLinkHash) {
      for (const link of episodeLinks) {
        if (link.getAttribute("href") === lastLinkHash) {
          link.focus();
          return;
        }
      }
    } else {
      document.getElementsByTagName("main")[0].focus();
    }
  }
};

const getEpisodeFromShowFeed = async (episodeId) => {
  try {
    const response = await fetch(`./data/${feedId}.json`);
    const { episodes: allEpisodes } = await response.json();
    return allEpisodes.find((ep) => ep.id === episodeId);
  } catch (err) {
    console.log("Error!", err);
    return null;
  }
};

const getMp3FilesForEpisode = async (episodeId) => {
  try {
    const response = await fetch(`./data/mp3-filemap.json`);
    const { files } = await response.json();
    return files.find(
      (file) => file.showId === showId && file.episodeId === episodeId
    );
  } catch (err) {
    console.log("Error!", err);
    return null;
  }
};

const onUrlHashChange = async function () {
  const { hash } = window.location;
  if (hash && hash !== backLinkHash) {
    lastLinkHash = hash;
    const episodeId = hash.replace("#", "");
    const episode = await getEpisodeFromShowFeed(episodeId);
    const episodeFile = await getMp3FilesForEpisode(episodeId);
    toggleEpisodeDetailsModal(episode, episodeFile);
  } else {
    toggleEpisodeDetailsModal();
  }
};

addEventListener("hashchange", onUrlHashChange);

const onLoadHash = window.location.hash;
if (onLoadHash && onLoadHash !== backLinkHash) {
  onUrlHashChange();
}

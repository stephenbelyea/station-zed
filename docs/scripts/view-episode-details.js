const modalOverlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");
const sections = document.getElementsByTagName("section");
const episodeLinks = document.getElementsByClassName("view-episode-link");

const backLinkHash = "#back";

const getFileDownloadLink = (fileId) =>
  `https://drive.google.com/u/0/uc?id=${fileId}&export=download`;

const templateEpisodeAudioPlayer = (episodeFile) => {
  if (!episodeFile || !episodeFile.fileId) return "";
  const { fileId, fileType } = episodeFile;
  return [
    `<audio controls preload="metadata">`,
    `<source src="${getFileDownloadLink(fileId)}" type="${fileType}" />`,
    `</audio>`,
  ];
};

const templateEpisodeMp3File = (id, episodeFile) => {
  if (!episodeFile || !episodeFile.fileId)
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
    ${imageUrl ? `<img src="${imageUrl}" alt="" />` : ""}
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

const setFocusToLastLink = () => {
  if (window.StationZed.lastLinkHash) {
    for (const link of episodeLinks) {
      if (link.getAttribute("href") === window.StationZed.lastLinkHash) {
        link.focus();
        return;
      }
    }
  } else {
    document.getElementsByTagName("main")[0].focus();
  }
};

const removeHashFromWindowLocation = () => {
  const { location, history } = window;
  if (location.hash) {
    const cleanUrl = location.toString().replace(location.hash, "");
    history.replaceState({}, document.title, cleanUrl);
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
    setFocusToLastLink();
    removeHashFromWindowLocation();
  }
};

const onUrlHashChange = async () => {
  const { hash } = window.location;
  if (hash && hash !== backLinkHash) {
    window.StationZed.lastLinkHash = hash;
    const episodeId = hash.replace("#", "");
    const { episodes } = await window.StationZed.showFeed;
    const { files } = await window.StationZed.mp3Filemap;

    const episode = episodes.find((ep) => ep.id === episodeId);
    const mp3File = files.find((file) => file.episodeId === episodeId);
    toggleEpisodeDetailsModal(episode, mp3File);
  } else {
    toggleEpisodeDetailsModal();
  }
};

addEventListener("hashchange", onUrlHashChange);

const onLoadHash = window.location.hash;
if (onLoadHash && onLoadHash !== backLinkHash) {
  onUrlHashChange();
}

addEventListener("keydown", ({ key }) => {
  if (key === "Escape" && modal.getAttribute("aria-modal") === "true") {
    toggleEpisodeDetailsModal();
  }
});

const modalOverlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");
const sections = document.getElementsByTagName("section");
const episodes = document.getElementById("episodes");

const feedId = episodes.getAttribute("data-feed-id");
const showId = episodes.getAttribute("data-show-id");

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

const templateEpisodeDetails = (
  { id, title, date, duration, imageUrl, content },
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
    <div class="episode-content">
      ${content}
    </div>
    <p class="back-to-episodes">
      <a href="./show-${showId}.html">Back to episodes list</a>
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
  } else {
    document.body.classList.remove("view-episode");
    modalOverlay.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    toggleSectionsAriaHidden();
    modal.innerHTML = "";
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

const onUrlHashChange = async () => {
  const { hash } = window.location;
  if (hash) {
    const episodeId = hash.replace("#", "");
    const episode = await getEpisodeFromShowFeed(episodeId);
    const episodeFile = await getMp3FilesForEpisode(episodeId);
    toggleEpisodeDetailsModal(episode, episodeFile);
  } else {
    toggleEpisodeDetailsModal();
  }
};

addEventListener("hashchange", onUrlHashChange);

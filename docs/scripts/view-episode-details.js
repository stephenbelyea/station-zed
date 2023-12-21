const modalOverlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");
const sections = document.getElementsByTagName("section");
const episodes = document.getElementById("episodes");

const feedId = episodes.getAttribute("data-feed-id");
const showId = episodes.getAttribute("data-show-id");

const templateEpisodeDetails = ({ title }) => `
  <div class="modal-body">
    <h2>${title}</h2>
    <p><a href="./show-${showId}.html">Back to episodes list</a></p>
  </div>
`;

const toggleSectionsAriaHidden = (ariaHidden = "false") => {
  for (let i = 0; i < sections.length; i++) {
    sections[i].setAttribute("aria-hidden", ariaHidden);
  }
};

const toggleEpisodeDetailsModal = (episode = null) => {
  console.log(episode);
  if (episode) {
    modal.innerHTML = templateEpisodeDetails(episode);
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

const onUrlHashChange = async () => {
  const { hash } = window.location;
  if (hash) {
    const episodeId = hash.replace("#", "");
    const episode = await getEpisodeFromShowFeed(episodeId);
    toggleEpisodeDetailsModal(episode);
  } else {
    toggleEpisodeDetailsModal();
  }
};

addEventListener("hashchange", onUrlHashChange);

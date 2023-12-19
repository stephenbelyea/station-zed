const episodesElem = document.getElementById("episodes");

const feedId = episodesElem.getAttribute("data-feed-id");
const showId = episodesElem.getAttribute("data-show-id");

const getShowFeed = async () => {
  try {
    const response = await fetch(`./data/${feedId}.json`);
    const showFeed = await response.json();
    return showFeed;
  } catch (err) {
    console.log("Error!", err);
    return null;
  }
};

const showFeed = await getShowFeed();
console.log(showFeed);

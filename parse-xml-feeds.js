const fs = require("fs");
const xml2js = require("xml2js");

const IDS = {
  STATIONZED: "stationzed",
  BOOZING_AND_BONDING: "boozing-and-bonding",
  SPRINGFIELD_THE_LATER_YEARS: "springfield-the-later-years",
  THE_DUST_OFF: "the-dust-off",
  WRESTLE_DADDIES: "wrestle-daddies",
};

const FEEDS = {
  CHANNEL: {
    STATIONZED: `channel-feed-${IDS.STATIONZED}`,
  },
  SHOW: {
    BOOZING_AND_BONDING: `show-feed-${IDS.BOOZING_AND_BONDING}`,
    SPRINGFIELD_THE_LATER_YEARS: `show-feed-${IDS.SPRINGFIELD_THE_LATER_YEARS}`,
    THE_DUST_OFF: `show-feed-${IDS.THE_DUST_OFF}`,
    WRESTLE_DADDIES: `show-feed-${IDS.WRESTLE_DADDIES}`,
  },
};

const xmlParser = new xml2js.Parser();

const getParsedXmlFeed = (feed) => {
  let parsedFeed;
  const xmlText = fs.readFileSync(`${__dirname}/xml-feeds/${feed}.xml`, "utf8");
  xmlParser.parseString(xmlText, function (error, result) {
    if (error === null) {
      parsedFeed = result?.rss?.channel[0];
    } else {
      console.log(error);
    }
  });
  return parsedFeed;
};

const getFeedInfo = (feed) => {
  const { title, description, copyright, image } = getParsedXmlFeed(feed);
  return {
    title: title[0],
    description: description[0],
    copyright: copyright[0],
    imageUrl: image[0].url[0],
    feedId: feed,
  };
};

const getFeedSingleItem = (singleItem, feed) => {
  const { title, link, pubDate, description, enclosure, ...item } = singleItem;

  const linkParts = link[0].split("/").filter((part) => part !== "");
  const idFromLink = linkParts[linkParts.length - 1];

  const dateObj = new Date(pubDate[0]);
  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);

  const commonItem = {
    feedId: feed,
    title: title[0],
    id: idFromLink,
    date: formattedDate,
    summary: item["itunes:subtitle"][0],
    fileUrl: enclosure[0]["$"].url,
    fileType: enclosure[0]["$"].type,
    show: item["itunes:author"][0],
    duration: item["itunes:duration"][0],
    explicit: item["itunes:explicit"][0],
    keywords: item["itunes:keywords"][0],
    content: description[0],
    imageUrl: "",
  };

  switch (feed) {
    case FEEDS.SHOW.BOOZING_AND_BONDING:
      return {
        ...commonItem,
        showId: IDS.BOOZING_AND_BONDING,
      };
    case FEEDS.SHOW.SPRINGFIELD_THE_LATER_YEARS:
      return {
        ...commonItem,
        showId: IDS.SPRINGFIELD_THE_LATER_YEARS,
      };
    case FEEDS.SHOW.WRESTLE_DADDIES:
      return {
        ...commonItem,
        showId: IDS.WRESTLE_DADDIES,
      };
    default:
      return {
        ...commonItem,
        showId: IDS.THE_DUST_OFF,
        content: item["content:encoded"][0],
        imageUrl: item["itunes:image"][0]["$"].href,
      };
  }
};

const getFeedItems = (feed) => {
  const { item: feedItems } = getParsedXmlFeed(feed);
  return feedItems
    .map((item) => getFeedSingleItem(item, feed))
    .filter((item) => item !== null);
};

const createJsonFeed = (feed) => {
  const feedInfo = getFeedInfo(feed);
  const feedItems = getFeedItems(feed);
  const feedJson = JSON.stringify({ show: feedInfo, episodes: feedItems });

  fs.writeFile(`${__dirname}/json-feeds/${feed}.json`, feedJson, (err) => {
    if (err) {
      console.error("Error! ", err);
    } else {
      console.log("Successful! ", feed);
    }
  });
};

createJsonFeed(FEEDS.SHOW.THE_DUST_OFF);
createJsonFeed(FEEDS.SHOW.BOOZING_AND_BONDING);
createJsonFeed(FEEDS.SHOW.SPRINGFIELD_THE_LATER_YEARS);
createJsonFeed(FEEDS.SHOW.WRESTLE_DADDIES);

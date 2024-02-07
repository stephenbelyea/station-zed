const { parse } = require("node-html-parser");

const getImageFromContent = (content) => {
  const parsedContent = parse(content);
  if (!parsedContent) return null;

  const images = parsedContent.querySelectorAll("img");
  if (images.length === 0) return null;

  const url = images[0].getAttribute("src");
  const urlParts = url.split("/");

  return {
    url,
    name: urlParts.slice(-1)[0],
  };
};

module.exports = {
  getImageFromContent,
};

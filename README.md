# Station Zed

> Podcasting from Eh to Zed

Station Zed is (was?) a podcast network originally built with WordPress to host and publish multiple shows. From 2016-2020, it was home to four: 'Boozing and Bonding', 'Springfield: The Early Years', 'The Dust Off', and 'Wrestle Daddies'.

This site is an ongoing effort to archive each show's original runs of episodes - including MP3 files, images, show notes, and other assets.

You can visit the live site via GitHub Pages: [stephenbelyea.github.io/stationzed](https://stephenbelyea.github.io/stationzed/)

## Generate JSON feeds from XML

Use the parse command to cycle through each show's XML feed and generate an associated JSON:

```bash
npm run parse
```

This will automatically update the `/json-feeds` files. It shouldn't be needed regularly, but makes for a helpful tool to avoid manually running through each show's XML.

## Run the site locally

Running the following from the project root will serve `docs/index.html`:

```bash
npm start
```

Your terminal will confirm the successful command. You can then find the site locally at: [localhost:3000](http://localhost:3000)

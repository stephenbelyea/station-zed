# Station Zed

> Podcasting from Eh to Zed

Station Zed is (was?) a podcast network originally built with WordPress to host and publish multiple shows. From 2016-2020, it was home to four: 'Boozing and Bonding', 'Springfield: The Early Years', 'The Dust Off', and 'Wrestle Daddies'.

This site is an ongoing effort to archive each show's original runs of episodes - including MP3 files, images, show notes, and other assets.

You can visit the live site via GitHub Pages: [stephenbelyea.github.io/stationzed](https://stephenbelyea.github.io/stationzed/)

## File management and upkeep

### Generate JSON feeds from XML

Use the parse command to cycle through each show's XML feed and generate an associated JSON:

```bash
npm run parse
```

This will automatically update the `/json-feeds` files. It shouldn't be needed regularly, but makes for a helpful tool to avoid manually running through each show's XML.

### Generate JSON filemap(s) from feeds

The parse command will also generate filemaps for episode MP3 and JPG files from the imported and translated XML feeds:

```bash
npm run parse
```

This will automatically update the `mp3-filemap.json` and `jpg-filemap.json` files under the `/json-feeds` folder. Be careful not to replace the filemap JSON files within the `/docs` folder, however, as this contains all the Google Drive file IDs for show episodes.

### Generate filenames for episode files

The parse command will also create `file-name-map.json`, a master list of all composed filenames for images, audio, etc.

This JSON file isn't used anywhere within the code currently, but it makes a handy source for copy and pasting when updating the name of files stored in Google Drive.

## Development and release

### Run the site locally

Running the following from the project root will serve `docs/index.html`:

```bash
npm start
```

Your terminal will confirm the successful command. You can then find the site locally at: [localhost:3000](http://localhost:3000)

### Build and release the site

This site is setup with GitHub Pages and will automatically queue a released whenever changes to the `main` branch are pushed to remote. There are no webpack-like build steps or pipeline processes in place, since this site is built with HTML, CSS, and vanilla JS.

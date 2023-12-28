# Station Zed

> Podcasting from Eh to Zed

Station Zed is (was?) a podcast network originally built with WordPress to host and publish multiple shows. From 2016-2020, it was home to four: 'Boozing and Bonding', 'Springfield: The Early Years', 'The Dust Off', and 'Wrestle Daddies'.

This site is an ongoing effort to archive each show's original runs of episodes - including MP3 files, images, show notes, and other assets.

You can visit the live site via GitHub Pages: [stephenbelyea.github.io/stationzed](https://stephenbelyea.github.io/stationzed/)

## Development and release

### Run the site locally

Running the following from the project root will serve `docs/index.html`:

```bash
npm start
```

Your terminal will confirm the successful command. You can then find the site locally at: [localhost:3000](http://localhost:3000)

### Build and release the site

This site is setup with GitHub Pages and will automatically queue a released whenever changes to the `main` branch are pushed to remote. There are no webpack-like build steps or pipeline processes in place, since this site is built with HTML, CSS, and vanilla JS.

## File management and upkeep

### Generate JSON show feeds from XML

Use the `create:feeds` command to cycle through each show's XML feed and generate an associated JSON file:

```bash
npm run create:feeds
```

This will automatically update the `/scripts/feeds` files. It shouldn't be needed regularly, but makes for a helpful tool to avoid manually running through each show's XML.

### Download and rename MP3 files

The `download:files` command maps through every JSON episode, fetches the MP3 file from the episode URL, renames it, and saves it to that series' respective sub-folder.

```bash
npm run download:files
```

This is a heavy process and takes a while, as 200+ download requests need to be run via `setTimeout` to avoid DDOS'ing the server.

This probably shouldn't be run regularly - if at all. Kind of a one-time thing.

### Generate JSON filemaps for MP3s and JPGs

The `create:filemaps` command will generate filemaps for episode MP3 and JPG files from the imported and translated XML feeds:

```bash
npm run create:filemaps
```

This will automatically update the `mp3-filemap.json` and `jpg-filemap.json` files under the `/scripts/filemaps` folder. It will also build `file-name-map.json`, a master-list of all show and episode IDs formatted as each episode's filename.

If `/scripts/shared` JSON files are populated with episode IDs and Google Drive file share IDs, the `mp3-filemap` will also be populated with the matching `fileId` for each entry.

As will other feed scripts in this project, it likely won't be needed regularly.

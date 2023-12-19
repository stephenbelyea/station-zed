# Station Zed

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

Your terminal will confirm the successful command. You can then find the site locally at: `http://localhost:3000`

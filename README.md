# [GW2AP](https://gw2ap.com)

## Running locally

```sh
git clone https://github.com/reks-scripts/gw2ap.git gw2ap
cd gw2ap
npm install
npm run dev-server
npm run dev-client
```

### Or start both the server and client with:

```sh
npm run dev
```

### Webpack production build

```sh
npm run build
```

### Docker
```sh
docker build -t gw2ap .
docker run -d -p 3000:3000 --name gw2ap gw2ap .
```

## License

MIT

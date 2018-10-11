gw2ap
===========
npm run build
docker build -t gw2ap .
docker run -d -p 3000:3000 --name gw2ap gw2ap .
eb deploy
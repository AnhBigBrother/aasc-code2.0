cd client
npm install
npm run build
cd ..
mkdir server/static -p
cp -r client/dist/* server/static
cd server
npm install
npm run build
node dist/main.js

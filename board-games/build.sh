cd client && npm run build && cd ..
mkdir server/static -p
cp -r client/dist/* server/static
cd server
npm run build
node dist/main.js

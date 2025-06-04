cd client && npm run build && cd ..
mkdir server/client -p
cp -r client/dist/* server/client
cd server
npm run build
node dist/main.js
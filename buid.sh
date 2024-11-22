!#/usr/bin
set -o exit
npm install
npx runmigration
npm run dev ./dist/index.js

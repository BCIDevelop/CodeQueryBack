!#/usr/bin
set -o exit
npm install
npx runmigration
npm run seed

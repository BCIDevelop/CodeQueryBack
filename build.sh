#!/bin/bash
set -e
npm install --only=production
npx runmigration
npm run seed

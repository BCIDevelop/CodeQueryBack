#!/bin/bash
set -e
npm install
npx runmigration
npm run seed

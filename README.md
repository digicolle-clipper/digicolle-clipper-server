required: node.js 0.12+, PostgreSQL 9.3+

createdb -U <username> digicolle
psql -U <username> digicolle -f setup.sql
npm install
node app

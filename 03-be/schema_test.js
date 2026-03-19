require('dotenv').config();
const pool = require('./config/db');
pool.query('SHOW COLUMNS FROM chapter')
  .then(([rows]) => {
    console.log(JSON.stringify(rows.find(c => c.Field === "createdat"), null, 2));
    process.exit(0);
  })
  .catch(console.error);

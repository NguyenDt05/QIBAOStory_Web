const pool = require('./config/db');
pool.query('SELECT chapterid, storyid, createdat FROM chapter ORDER BY chapterid DESC LIMIT 10')
  .then(([rows]) => {
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  })
  .catch(console.error);

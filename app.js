const express = require('express');
const app = express();
const port = 3000;


app.get('/', function(req, res) {
    res.send('Hello from root route.')
  });

  app.use('/url', require('./src/rawHtml'));

  app.use('/scrape/coursera', require('./src/coursera/course'));
  app.use('/scrape/coursera', require('./src/coursera/partner'));
  app.use('/scrape/coursera', require('./src/coursera/instructor'));
  app.use('/scrape/coursera', require('./src/coursera/reviews'));
 


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
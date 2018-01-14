require('dotenv').config();
const request = require('request');
const restify = require('restify');
const server = restify.createServer();
const Twitter = require('./twitter');

const handleResponse = (profileURLs, req, res) => {
  if (req.getContentType() === 'application/json') {
    return res.send(profileURLs);
  } else {
    const imageURL = profileURLs[req.query.size] || profileURLs.original;

    request
      .get(imageURL)
      .on('error', function(err) {
        console.log(err);
      })
      .pipe(res);
  }
};

server.use(restify.plugins.queryParser());

server.get('/:handle', async function (req, res) {
  if (!req.params.handle) {
    return res.send(400);
  }

  const profileURLs = await Twitter.getProfileURLs(req.params.handle);

  return handleResponse(profileURLs, req, res);
});

server.get('/.+', function (req, res) {
  return handleResponse(Twitter.defaultProfile, req, res);
});

server.listen(process.env.PORT || 9090, function () {
  console.log('ready on %s', server.url);
});

process.on('uncaughtException', function (err) {
  console.log(err);
});

process.on('unhandledRejection', function (err) {
  console.log(err);
});

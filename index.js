require('dotenv').config();
const request = require('request');
const restify = require('restify');
const server = restify.createServer();
const Twitter = require('twitter');
const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const getProfileURLs = async handle => {
  return new Promise((resolve, reject) => {
    if (handle[0] === '@') handle = handle.slice(1);
    twitter.get('users/show', {
      user_id: handle,
      screen_name: handle
    }, (err, user, response) => {
      if (err || !user) {
        return reject(err);
      }

      const profileURLs = {
        normal: user.profile_image_url_https,
        bigger: user.profile_image_url_https.replace('_normal.', '_bigger.'),
        mini: user.profile_image_url_https.replace('_normal.', '_mini.'),
        original: user.profile_image_url_https.replace('_normal.', '.'),
        '200x200': user.profile_image_url_https.replace('_normal.', '_200x200.'),
        '400x400': user.profile_image_url_https.replace('_normal.', '_400x400.')
      }
      return resolve(profileURLs);
    });
  });
};

server.use(restify.plugins.queryParser());

// Handle some stuff we dont have
server.get('favicon.ico', (req, res) => res.send(404));
server.get('sw.js', (req, res) => res.send(404));

server.get('/:handle', async function (req, res) {
  if (!req.params.handle) {
    return res.send(400);
  }

  let profileURL;

  try {
    profileURLs = await getProfileURLs(req.params.handle);
  } catch (err) {
    profileURLs = {
      original: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
    };
  }

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

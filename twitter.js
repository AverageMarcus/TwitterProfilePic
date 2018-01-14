const Twitter = require('twitter');
const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const defaultProfile = {
  original: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
};

const cleanHandle = handle => (handle[0] === '@') ? handle.slice(1) : handle;

const getProfileURLs = async handle => {
  handle = cleanHandle(handle);

  return new Promise((resolve, reject) => {
    twitter.get('users/show', {
      user_id: handle,
      screen_name: handle
    }, (err, user, response) => {
      if (err || !user) {
        return resolve(defaultProfile);
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

module.exports = {
  getProfileURLs,
  defaultProfile
};

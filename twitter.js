const cache = require('./cache');
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
const rateLimit = {
  remaining: Infinity,
  reset: new Date()
};

const cleanHandle = handle => (handle[0] === '@') ? handle.slice(1) : handle;
const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout * 1000));
const handleRateLimit = async () => {
  if (rateLimit.remaining <= 1) {
    console.log('Rate limit hit, waiting until reset');
    await sleep(rateLimit.reset - new Date());
  } else if (rateLimit.remaining < 10) {
    console.log('Waiting for 10s due to rate limiting');
    await sleep(10);
  } else if (rateLimit.remaining < 500) {
    console.log('Waiting for 1s due to rate limiting');
    await sleep(1);
  }
};

const fetchFromTwitter = async handle => {
  await handleRateLimit();
  return new Promise((resolve, reject) => {
    twitter.get('users/show', {
      user_id: handle,
      screen_name: handle
    }, (err, user, response) => {
      if (err || !user) {
        return resolve(defaultProfile);
      }

      rateLimit.remaining = response.headers['x-rate-limit-remaining'];
      rateLimit.reset = new Date(response.headers['x-rate-limit-reset'] * 1000);

      const profileURLs = {
        normal: user.profile_image_url_https,
        bigger: user.profile_image_url_https.replace('_normal.', '_bigger.'),
        mini: user.profile_image_url_https.replace('_normal.', '_mini.'),
        original: user.profile_image_url_https.replace('_normal.', '.'),
        '200x200': user.profile_image_url_https.replace('_normal.', '_200x200.'),
        '400x400': user.profile_image_url_https.replace('_normal.', '_400x400.')
      }
      // Try and mitigate hitting rate limit
      cache.save(handle, profileURLs);
      return resolve(profileURLs);
    });
  });
}

const getProfileURLs = async handle => {
  handle = cleanHandle(handle);
  return await cache.get(handle)|| await fetchFromTwitter(handle);
};

module.exports = {
  getProfileURLs,
  defaultProfile
};

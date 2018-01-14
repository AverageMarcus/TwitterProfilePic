let redis, redisAvailable;

if (process.env.REDIS_URL) {
  redis = require("redis").createClient({ url: process.env.REDIS_URL });

  redis.on('error', err => {
    console.log(err);
    redisAvailable = false;
  });

  redis.on('ready', () => {
    console.log('Redis ready');
    redisAvailable = true;
  });
}

const get = async key => {
  if (!redisAvailable) return;
  return new Promise(resolve => {
    redis.get(key, (err, data) => {
      return resolve(data ? JSON.parse(data) : data);
    });
  });
};

const save = (key, data) => {
  if (!redisAvailable) return;
  redis.set(key, JSON.stringify(data), 'EX', 86400);
};

module.exports = {
  get, save
};

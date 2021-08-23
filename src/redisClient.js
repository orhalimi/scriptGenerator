const redis = require('redis');
const { promisifyAll } = require('bluebird');

// This creates an async equivalent of each function, adding Async as a suffix.
promisifyAll(redis);

const client = redis.createClient({
    host: 'redis',
    port: '6379',
});

client.on('error', err => {
    console.log('Error ' + err);
});

export default client
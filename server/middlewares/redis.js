const { createClient } = require('redis')
const hash = require('object-hash')
let redisClient = undefined // Kinda not safe

exports.initRedisClient= async (cfg) => {
  let redisURL = cfg.redisUrl

  if (redisURL) {
    redisClient = createClient({
      url: redisURL
    }).on('error', (err) => {
      console.log('Error ' + err)
    })

    try {
      await redisClient.connect()
      console.log('Redis client connected')
    } catch (err) {
      console.log('REDIS: Error ' + err)
    }
  } else {
    console.log('REDIS: No URL found')
  }
}

exports.requestToKey = (req) => {
  const reqDataToHash = {
    query: req.query,
    body: req.body,
  }

  return `${req.path}@${hash.sha1(reqDataToHash)}`
}

exports.checkStatus = () => {
  return !!redisClient?.isOpen
}

// Options
//  EX, // the specified expire time in seconds
//  PX, // the specified expire time in milliseconds
//  EXAT, // the specified Unix time at which the key will expire, in seconds
//  PXAT, // the specified Unix time at which the key will expire, in milliseconds
//  NX, // write the data only if the key does not already exist
//  XX, // write the data only if the key already exists
//  KEEPTTL, // retain the TTL associated with the key
//  GET, // return the old string stored at key, or "undefined" if key did not exist
exports.writeData = async (key, data, options) => {
  console.log(key, data, options)
  if (this.checkStatus()) {
    try {
      await redisClient.set(key, data, options)
    } catch (err) {
      console.log(`REDIS: Error -> Failed to cache data for key=${key} ` + err)
    }
  }
}

exports.readData = async (key) => {
  let cachedValue = undefined

  if (this.checkStatus()) {
    try {
      const data = await redisClient.get(key)
      if (cachedValue) {
        return data
      }
    } catch (err) {
      console.log(`REDIS: Error -> Failed to retrieve data for key=${key} ` + err)
    }
  }
}

exports.redisCacheMiddleware =(
  options = {
    EX: 21600, // 6h
  },
  compression = true // enable compression and decompression by default
) => {
  return async (req, res, next) => {
    if (!this.checkStatus()) {
      return next();
    }

    const key = this.requestToKey(req);
    const cachedValue = await this.readData(key);

    if (cachedValue) {
      try {
        return res.json(JSON.parse(cachedValue));
      } catch {
        return res.send(cachedValue);
      }
    } else {
      let responseBody = '';

      // Capture the response data
      const oldWrite = res.write.bind(res);
      const oldEnd = res.end.bind(res);
      const oldJson = res.json.bind(res);
      const oldSend = res.send.bind(res);

      res.write = (chunk, ...args) => {
        responseBody += chunk;
        oldWrite(chunk, ...args);
      };

      res.end = (chunk, ...args) => {
        if (chunk) {
          responseBody += chunk;
        }
        oldEnd(chunk, ...args);

        if (res.statusCode.toString().startsWith("2") && responseBody) {
          this.writeData(key, responseBody, options).then();
        }
      };

      res.json = (data) => {
        responseBody = JSON.stringify(data);
        oldJson(data);
      };

      res.send = (data) => {
        if (typeof data === 'string' || Buffer.isBuffer(data)) {
          responseBody = data;
        } else if (typeof data === 'object') {
          responseBody = JSON.stringify(data);
        }
        oldSend(data);
      };

      next();
    }
  };
}

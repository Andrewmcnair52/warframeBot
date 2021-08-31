var https = require('https');

const get = (url) => new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
        let data = '';
        res.on('data', (d) => { data += d; });
        res.on('end', () => { resolve(data); });
    });
    req.on('error', (e) => { reject(e); });
});


module.exports = (url) => new Promise((resolve, reject) => {
    get(url)
        .then((resp) => JSON.parse(resp))
        .then(resolve)
        .catch(reject);
});
const http = require('http');
const config = require('../../../config/config.json');

async function signup(_body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(_body);
        const options = {
            hostname: config.employeeApi.host,
            port: config.employeeApi.port,
            path: config.employeeApi.path + '/create',
            method: 'POST',
            headers: {
                'Content-Type': config.employeeApi.contentType,
                'Content-Length': data.length
            }
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (data) => (body += data.toString()));
            res.on('error', reject);
            res.on('end', () => {
              if (res.statusCode >= 200 && res.statusCode <= 299) {
    
                resolve(JSON.parse(body).data);
              } else {
                reject(res.statusCode + ': ' + JSON.parse(body).message);
              }
            });
        })

        req.on('error', reject);
        req.write(data, 'binary');
        req.end();
    });
}


exports.signup = signup;
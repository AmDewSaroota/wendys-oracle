const crypto = require('crypto');

const ACCESS_ID = '7dudg9tg3cwvrf8dx9na';
const ACCESS_SECRET = 'f51fa230ddf343478ae5616c52b51111';
const BASE_URL = 'https://openapi-sg.iotbing.com';
const DEVICE_ID = 'a3d01864e463e3ede0hf0e';

function generateSign(method, path, timestamp, accessToken, body) {
  accessToken = accessToken || '';
  body = body || '';
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = ACCESS_ID + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', ACCESS_SECRET).update(signStr).digest('hex').toUpperCase();
}

async function main() {
  const ts1 = Date.now().toString();
  const tokenPath = '/v1.0/token?grant_type=1';
  const resp1 = await fetch(BASE_URL + tokenPath, {
    headers: { client_id: ACCESS_ID, sign: generateSign('GET', tokenPath, ts1), t: ts1, sign_method: 'HMAC-SHA256' }
  });
  const tokenData = await resp1.json();
  if (!tokenData.success) { console.log('Token failed:', tokenData); return; }
  const token = tokenData.result.access_token;

  const ts2 = Date.now().toString();
  const statusPath = '/v1.0/devices/' + DEVICE_ID + '/status';
  const resp2 = await fetch(BASE_URL + statusPath, {
    headers: { client_id: ACCESS_ID, access_token: token, sign: generateSign('GET', statusPath, ts2, token), t: ts2, sign_method: 'HMAC-SHA256' }
  });
  const data = await resp2.json();
  console.log('MT13W status:');
  console.log(JSON.stringify(data, null, 2));
}
main();

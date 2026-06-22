function md5cycle(x, k) {
  let [a, b, c, d] = x;
  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);
  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = hh(a, b, c, d, k[5], 4, -51403784);
  d = hh(d, a, b, c, k[8], 11, 1735328473);
  c = hh(c, d, a, b, k[11], 16, -1926607734);
  b = hh(b, c, d, a, k[14], 23, -378558);
  a = hh(a, b, c, d, k[1], 4, -2022574463);
  d = hh(d, a, b, c, k[4], 11, 1839030562);
  c = hh(c, d, a, b, k[7], 16, -35309556);
  b = hh(b, c, d, a, k[10], 23, -1530992060);
  a = hh(a, b, c, d, k[13], 4, 1272893353);
  d = hh(d, a, b, c, k[0], 11, -155497632);
  c = hh(c, d, a, b, k[3], 16, -1094730640);
  b = hh(b, c, d, a, k[6], 23, 681279174);
  a = hh(a, b, c, d, k[9], 4, -358537222);
  d = hh(d, a, b, c, k[12], 11, -722521979);
  c = hh(c, d, a, b, k[15], 16, 76029189);
  b = hh(b, c, d, a, k[2], 23, -640364487);
  a = ii(a, b, c, d, k[0], 6, -421815835);
  d = ii(d, a, b, c, k[7], 10, 530742520);
  c = ii(c, d, a, b, k[14], 15, -995338651);
  b = ii(b, c, d, a, k[5], 21, -198630844);
  a = ii(a, b, c, d, k[12], 6, 1126891415);
  d = ii(d, a, b, c, k[3], 10, -1416354905);
  c = ii(c, d, a, b, k[10], 15, -57434055);
  b = ii(b, c, d, a, k[1], 21, 1700485571);
  a = ii(a, b, c, d, k[8], 6, -1894986606);
  d = ii(d, a, b, c, k[15], 10, -1051523);
  c = ii(c, d, a, b, k[6], 15, -2054922799);
  b = ii(b, c, d, a, k[13], 21, 1873313359);
  a = ii(a, b, c, d, k[4], 6, -30611744);
  d = ii(d, a, b, c, k[11], 10, -156019838);
  c = ii(c, d, a, b, k[2], 15, 1309151649);
  b = ii(b, c, d, a, k[9], 21, -145523070);
  a = ii(a, b, c, d, k[14], 6, -1120210379);
  d = ii(d, a, b, c, k[1], 10, 718787259);
  c = ii(c, d, a, b, k[8], 15, -343485551);
  b = ii(b, c, d, a, k[15], 21, -660478335);
  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md51(s) {
  const txt = '';
  const n = s.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  const tail = new Array(16).fill(0);
  for (i = 0; i < s.length; i += 1) {
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    tail.fill(0);
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

function md5blk(s) {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i)
      + (s.charCodeAt(i + 1) << 8)
      + (s.charCodeAt(i + 2) << 16)
      + (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

function rhex(n) {
  let s = '';
  for (let j = 0; j < 4; j += 1) {
    s += (`0${(n >> (j * 8) & 0xFF).toString(16)}`).slice(-2);
  }
  return s;
}

function hex(x) {
  return x.map(rhex).join('');
}

function md5(s) {
  return hex(md51(s));
}

function add32(a, b) {
  return (a + b) & 0xFFFFFFFF;
}

function normalizeValue(value) {
  return String(value ?? '').trim();
}

function urlEncodePayFast(value) {
  return encodeURIComponent(normalizeValue(value)).replace(/%20/g, '+');
}

export function getPayFastProcessUrl(environment) {
  return environment === 'live'
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process';
}

export function buildPayFastPayload(settings, booking) {
  const [name_first, name_last] = booking.customer_name.split(' ', 2);
  const payload = {
    merchant_id: settings.merchant_id,
    merchant_key: settings.merchant_key,
    return_url: settings.return_url,
    cancel_url: settings.cancel_url,
    notify_url: settings.notify_url,
    m_payment_id: booking.id,
    amount: booking.amount_due.toFixed(2),
    item_name: `MoveIt booking ${booking.id}`,
    item_description: booking.move_description || `${booking.pickup_address} → ${booking.dropoff_address}`,
    name_first: name_first || 'Customer',
    name_last: name_last || 'MoveIt',
    email_address: `${booking.customer_phone.replace(/\D/g, '')}@example.com`,
    cell_number: booking.customer_phone,
  };
  const signed = { ...payload, signature: signPayload(payload, settings.passphrase || '') };
  return signed;
}

function signPayload(fields, passphrase = '') {
  const cleanedFields = { ...fields };
  const sortedKeys = Object.keys(cleanedFields).sort();
  const stringToSign = sortedKeys
    .map((key) => `${key}=${urlEncodePayFast(cleanedFields[key])}`)
    .join('&')
    + (passphrase ? `&passphrase=${urlEncodePayFast(passphrase)}` : '');
  return md5(stringToSign);
}

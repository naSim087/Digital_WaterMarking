const crypto = require('crypto');

exports.encrypt = (data, cipher) => {
  const encrypted = cipher.update(data, 'utf8', 'hex');
  return encrypted + cipher.final('hex');
};

exports.decrypt = (encrypted, decipher) => {
  const decrypted = decipher.update(encrypted, 'hex', 'utf8');
  return decrypted + decipher.final('utf8');
};


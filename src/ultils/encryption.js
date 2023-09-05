const crypto = require('crypto');

// Khóa bí mật để mã hoá và giải mã dữ liệu
// const secretKey = 'your-secret-key';

// Hàm mã hoá dữ liệu
function encryptData(data,secretKey) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Hàm giải mã dữ liệu
function decryptData(encryptedData,secretKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update((encryptedData), 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

module.exports = {
  encryptData,
  decryptData
};


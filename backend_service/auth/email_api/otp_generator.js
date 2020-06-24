var otpGenerator = require('otp-generator')
const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
module.exports={otp}
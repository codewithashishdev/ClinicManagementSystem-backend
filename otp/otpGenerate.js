const otpGenerator = require('otp-generator');
module.exports.generateOTP = () => {
    otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
}
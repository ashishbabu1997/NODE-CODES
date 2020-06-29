import  * as otpGenerator from "otp-generator"
export const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
import nodemail from "nodemailer";
import readEp from "./readEP.js";

const ep = readEp;
console.log("loaded");

const transporter = nodemail.createTransport({
  service: "gmail",
  auth: {
    user: ep.email,
    pass: ep.pass,
  },
});
const random4Digt = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const mailOptions = (email, otp) => {
  return {
    from: ep.email,
    to: `${email}`,
    subject: "OTP WORDLY APP SIGIN AUTHENTICATION",
    text: `YOUR OTP FOR SIGING INTO WORDLY APP IS ${otp}`,
  };
};

export default async (email) => {
  const result = {};
  const otp = random4Digt();
  try {
    await transporter.sendMail(mailOptions(email, otp));
    result.otp = otp;
  } catch (error) {
    result.error = { authError: "INVALID_EMAIL" };
  }
  result.email = email;
  return result;
};

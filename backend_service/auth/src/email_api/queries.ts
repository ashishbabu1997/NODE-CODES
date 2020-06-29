
import * as Pool from "pg"
import * as nodemailer from "nodemailer"
import * as otp  from "./otp_generator"
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ellowai',
  password: 'Ash1526$',
  port: 5432,
})
pool.connect();
export const createUser = (request, response) => {
  const email= request.body.email;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourmail@gmail.com',
      pass: 'password'
    }
  });
  var mailOptions = {
    from: 'yourmail@gmail.com',
    to: email,
    subject: 'Your Ellow.AI otp is here',
    text:otp
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('OTP has send successfully: ' + info.response);
    }
  });
  pool.query('INSERT INTO ellow  (email,otp) VALUES ($1)',[email,otp], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Email added: ${email}`)
    pool.end();
  })
  
}



const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ellowai',
  password: 'Ash1526$',
  port: 5432,
})
pool.connect();
const validate_otp = (request, response) => {
  const otp= request.body.otp;
  pool.query('SELECT otp FROM ellow WHERE otp = ($1)',[otp], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(` ${otp}: Your otp verified`)
    pool.end();
  })

}
module.exports={validate_otp}


import {Pool} from 'pg';
import * as dotenv from 'dotenv'
dotenv.config()
export default () => {
    return new Pool({
        "user": process.env.USER,
        "host": process.env.HOST,
        "database": process.env.DATABASE,
        "password": process.env.PASSWORD,
        "port":process.env.PORT
    });
}



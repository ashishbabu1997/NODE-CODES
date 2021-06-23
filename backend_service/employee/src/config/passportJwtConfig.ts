import * as passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import jwtConfig from './config';
const dotenv = require('dotenv');
dotenv.config();

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: process.env.TOKEN_SECRET
}

export default () => {
    passport.use(new Strategy(opts, (jwt_payload, done) => {
        return done(null, jwt_payload);
    }));
};
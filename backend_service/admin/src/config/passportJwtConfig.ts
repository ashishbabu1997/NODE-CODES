import * as passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import jwtConfig from './config';


const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: jwtConfig.jwtSecretKey
}

export default () => {
    passport.use(new Strategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload,"asdsf")
        return done(null, jwt_payload);
    }));
};
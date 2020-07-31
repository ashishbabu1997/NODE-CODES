import {Pool} from 'pg';
import config from '../../config/config';
export default () => {
    return new Pool(config.db);
}

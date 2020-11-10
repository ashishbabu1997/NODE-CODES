import languageQuery from './query/languageQuery';
import database from '../common/database/database';
import CacheService from '../common/cache/nodeCache';

const ttl = 7 * 24 * 60 * 60; // cache for 1week
const cache = new CacheService(ttl); // Create a new cache service instance

export const listLanguages = () => {    
    const query = {
        name: 'fetch-language-list',
        text: languageQuery.getLanguageList,
        values: [],
    }
    return cache.get('data', () => 
    database().query(query).then((results,error) => {
        if (error) {
            return ({ code: 400, message: "Failed. Please try again.", data: {} });
        }
        return({ code: 200, message: "Languages listed succesfully", data: {languages: results.rows } });   
    }).then((result) => {
        return  result;
    })
    );
}

export const flushCache = () => {    
    return new Promise((resolve) => {
        cache.flush();
        resolve ({ code: 200, message: "Languages cache flushed succesfully", data:  {}  });
    })
}
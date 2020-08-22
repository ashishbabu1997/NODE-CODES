import {listCountries} from './countryApi.manager';
import sendResponse from '../common/response/response';
export const getCountriesList = (req, res) => {
    listCountries().then((response: any) => {
        sendResponse(res, response.code, 1,200, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,400, error.message, error.data)
    })
}
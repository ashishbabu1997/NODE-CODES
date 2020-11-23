import config from '../config/config'


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get all countries list 
export const listCountries = () => {
    return new Promise((resolve, reject) => {
            resolve({ code: 200, message: "Countries listed Succesfully", data: { countries: config.countries }});
    });
}
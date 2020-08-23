import config from '../config/config'
export const listCountries = () => {
    return new Promise((resolve, reject) => {
            resolve({ code: 200, message: "Countries listed Succesfully", data: { countries: config.countries }});
    });
}
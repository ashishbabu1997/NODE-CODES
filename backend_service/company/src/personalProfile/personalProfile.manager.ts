import profileQuery from './query/query';
import database from '../common/database/database';
import config from '../config/config';

export const getCompanyDetails = (_body) => {
    return new Promise((resolve, reject) => {
        _body["userCompanyId"] = _body.userRoleId == 1 ? _body["userCompanyId"] : _body.companyId;
        
        const query = {
            name: 'get-personal-profile',
            text: profileQuery.getProfiles,
            values: [parseInt(_body.userCompanyId)],
        }
        
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            const data = results.rows;
            let result = {}
            if (data.length > 0) {
                let locations = [];
                result = {
                    companyName: data[0].companyName,
                    description: data[0].description,
                    companySize: data[0].companySize,
                    services: data[0].services,
                    skills: data[0].skills,
                    companyLogo: data[0].companyLogo,
                    companyCoverPage: data[0].companyCoverPage,
                    locations
                }
                data.forEach(element => {
                    locations.push({
                        addressLine1: element.addressLine1,
                        addressLine2: element.addressLine2,
                        zipCode: element.zipCode,
                        city: element.city,
                        country: element.countryId!==null?config.countries.find(e => e.id == element.countryId).name:""
                    })
                });
            }
            resolve({ code: 200, message: "Personal profile listed successfully", data: result });

        })
    })
}
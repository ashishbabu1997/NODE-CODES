import AppConfig from './config/config';
import CompanyController from './company.controller';


export default class CompanyRouter {
    companyController = new CompanyController();
    constructor(app) {
        app
            .get(`/api/${AppConfig.version}/company/locations/:companyId`, this.companyController.getlocations)
    }
}




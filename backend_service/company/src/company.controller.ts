import CompanyManager from './company.manager';
import ResponseService from './common/response/response';

export default class CompanyController extends CompanyManager {
    responseService: ResponseService;
    constructor() {
        super();
        this.responseService = new ResponseService();
    }

    getlocations = (req, res) => {
        const body = req.params;
        this.fetchCompanyLocations(body).then((response: any) => this.responseService.sendResponse(res, response.code, 1, response.message, response.data))
            .catch((error: any) => this.responseService.sendResponse(res, error.code, 0, error.message, error.data))
    }

}
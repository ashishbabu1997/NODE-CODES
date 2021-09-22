import * as ellowRecuiterManager from "./ellowRecruiter.manager"
import sendResponse from '../common/response/response';
import * as fs from 'fs';

export const recruiterGetSignup = (req, res) => {
    const query = req.params;
    switch (query.style) {
        case "style.css" :
        fs.readFile('./src/recruiterSignup/style.css', function(err, data) {
            if (err) { 
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }             
            res.writeHead(200, {"Content-Type": "text/css"});
            res.write(data);     
            return res.end();
        });
        break;
        
        case "signup" :
        fs.readFile('./src/recruiterSignup/index.html', function(err, data) {
            if (err) { 
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            return res.end();
        });
        break;
        
        default:
        res.writeHead(200, {"Content-Type": "text/html"});
        return res.end("404 Not Found");
    }
}


export const recruiterPostSignup = (req, res) => {
    const body = req.body;
    ellowRecuiterManager.recruiterPostSignup(body).then((response: any) => {
        sendResponse(res, response.code, 1,201, response.message, response.data)
    }).catch(error => {
        sendResponse(res, error.code, 0,401, error.message, error.data)
    })    
}
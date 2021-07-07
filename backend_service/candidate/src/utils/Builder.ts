import { nanoid } from 'nanoid';
import * as nodeCache from 'node-cache';
import * as htmlToPdf from "html-pdf-node";
import * as utils from './utils';
import * as fs from 'fs';
const myCache = new nodeCache();

export const getCache = () => { return myCache }

export const pdfBuilder = async (candidateId, host) => {
    let uniqueId = nanoid()
    myCache.set(uniqueId, candidateId);
    var base64str = utils.base64_encode('./src/utils/ellow_logo.png');

    let options = {
        format: 'A4',
        printBackground: true,
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        displayHeaderFooter: true,
        footerTemplate: `<div style="color: #4A4A4A; font-size: 8px;  padding-top: 5px; text-align: right; width: 95%;"> <span>© 2021 ellow.io</span></span> </div>`,
        headerTemplate: `<div style="color: #4A4A4A; font-size: 10px; padding-top: 5px; text-align: right; width: 95%; margin-right: 0px;"> <a href="https://ellow.io/" target="_blank" style ="display: flex; flex-direction: row-reverse;"> <img src=${base64str} width="70" alt="ellow.io" style="display:block;" /> </a> </div>`,
        margin: {
            bottom: 50, // minimum required for footer msg to display
            top: 50,
        },

    };
    let file = { url: host + "/sharePdf/" + uniqueId };

    let pdfBuffer = await htmlToPdf.generatePdf(file, options);
    return pdfBuffer;
}

export const tempToken = (req) => {
    let uniqueId = nanoid()
    myCache.set(uniqueId, true, 300);
    return uniqueId;
}

export const checkKey = (key) => {
    return myCache.has(key);
}

export const takeKey = (key) => {
    return myCache.take(key);
}

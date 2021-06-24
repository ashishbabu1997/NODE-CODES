import { nanoid } from 'nanoid';
import * as nodeCache from 'node-cache';
import * as htmlToPdf from "html-pdf-node";

const myCache = new nodeCache(); 

export const getCache = () => { return myCache }

export const pdfBuilder = async (candidateId, host) => {
    let uniqueId = nanoid()
    myCache.set(uniqueId, candidateId);
    let options = { format: 'A4', printBackground: true, headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
    let file = { url: host + "/sharePdf/" + uniqueId };

    let pdfBuffer = await htmlToPdf.generatePdf(file, options);
    return pdfBuffer;
}

export const tempToken = (req) =>{
    let uniqueId = nanoid()    
    myCache.set(uniqueId,true,300);
    return uniqueId;
}

export const checkKey = (key) =>{
    return myCache.has(key);
}

export const takeIp = (key) =>{
    return myCache.take(key);
}
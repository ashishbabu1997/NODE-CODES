export const domainExtractor=(email)=>{
    var domain = email. substring(email. lastIndexOf("@")+1);
    return domain
}
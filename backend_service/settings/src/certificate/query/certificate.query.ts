export default {
    getCertificate : 'select certificate_id as "certificateId", certificate_name  as "certificateName" from certificates c where status = true',
    addCertificate : "insert into certificates(certificate_name, created_on, status) values ($1, $2, true)",
    updateCertificate : "update certificates set certificate_name = $1, updated_on = $2 where certificate_id = $3",
    deleteCertificate : "update certificates set status = false where certificate_id = $1"
}
export default {
    getCompanyCertifications: 'SELECT c.company_certification_id AS "companyCertificationId",ct.certificate_name as "certificateName" , c.certificate_id AS "certificationId",c.certificate_number AS "certificationNumber", c.logo as "logo", c.document as "document", c.certification_type AS "certificationType"  FROM company_certifications c INNER JOIN certificates ct ON ct.certificate_id=c.certificate_id WHERE c.company_id  = $1 AND c.status = true ORDER BY 1 DESC ',
    addCompanyCertifications: "INSERT INTO company_certifications( company_id, certificate_id, certificate_number, logo, document, status, created_on, certification_type) VALUES ($1, $2, $3, $4, $5, true, $6, $7)",
    updateCompanyCertifications:  "UPDATE company_certifications SET company_id = $1, certificate_id = $2, certificate_number = $3, logo = $4, document = $5, updated_on = $6, certification_type = $7 WHERE company_certification_id = $8",
    deleteCompanyCertifications:"delete from company_certifications WHERE company_certification_id = $2",
    getProfilePercentage: 'SELECT profile_percentage as "profilePercentage" FROM company WHERE company_id = $1',
    updateProfilePercentage:'UPDATE company SET profile_percentage=$1 WHERE company_id=$2'
}
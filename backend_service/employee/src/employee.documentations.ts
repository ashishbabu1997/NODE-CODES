/**
* @swagger
* /getCompanyByEmail:
*   get:
*     tags:
*       - Employees
*     name: Company Data By Email
*     summary: get company details with workmailId extension
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: query 
*         name: emailId
*         schema:
*         format: email
*         required:
*           type: string
*     responses:
*       200:
*         description: Api success
*       400:
*         description: Api Failed
*       401:
*         description: Unauthorised access
*       403:
*         description: Permission denied
*       500:
*         description: Server down
*/

/**
* @swagger
* /:
*   post:
*     tags:
*       - Employees
*     name: Customer Registration
*     summary: Customer registration for public companies
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             email:
*               type: string            
*             companyName:
*               type: string
*             firstName:
*               type: string
*             lastName :
*               type: string 
*             accountType:
*               type: integer
*               description: 1 for hirer,2 for provider
*             telephoneNumber:
*               type: integer
*           required: [email,companyName,firstName,lastName,accountType]
*     responses:
*       200:
*         description: Api success
*       400:
*         description: Api Failed
*       401:
*         description: Unauthorised access
*       403:
*         description: Permission denied
*       500:
*         description: Server down
*/

/**
* @swagger
* /addEmployeeByAdmin:
*   post:
*     tags:
*       - Employees
*     name: Customer Registration
*     summary: Customer registration for companies through ellow recuiter portal
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     security:
*       - bearerAuth: []
*     parameters:
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             email:
*               type: string
*             employeeCompanyId:
*                type: integer
*                description: null in case the company is not previously registered
*             companyName:
*               type: string
*             firstName:
*               type: string
*             lastName :
*               type: string 
*             accountType:
*               type: integer
*               description: 1 for hirer,2 for provider
*             telephoneNumber:
*               type: integer
*           required: [email]
*     responses:
*       200:
*         description: Api success
*       400:
*         description: Api Failed
*       401:
*         description: Unauthorised access
*       403:
*         description: Permission denied
*       500:
*         description: Server down
*/
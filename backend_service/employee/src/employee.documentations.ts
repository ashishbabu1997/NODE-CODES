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
* /freelancer:
*   post:
*     tags:
*       - Employees
*     name: Freenlancer Registration
*     summary: Freelancer registration API call
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
*             firstName:
*               type: string
*             lastName :
*               type: string 
*             yoe:
*               type: number
*             telephoneNumber:
*               type: integer
*           required: [email,firstName,lastName,telephoneNumber]
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
* /freelancer/setTokenAndPassword:
*   post:
*     tags:
*       - Employees
*     name: Freenlancer Reset token and set password
*     summary: Freelancer reset token and set password API call
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
*             token:
*               type: string
*             password:
*               type: string
*             url:
*               type:string
*           required: [token,password]
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

/**
* @swagger
* /verifyToken:
*   get:
*     tags:
*       - Employees
*     name: verify token validity
*     summary: Check whether the token exists or not
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: query 
*         name: token
*         schema:
*         format: token
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

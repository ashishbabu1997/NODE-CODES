/**
* @swagger
* /admin/listUsers:
*   get:
*     tags:
*       - Admins
*     name: list of all customers for registration (Seller view)
*     summary: Get list of all customers for registration
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: sortBy
*         schema:
*           type: string
*         enum: [firstName,lastName,email,phoneNumber]
*       - in: query
*         name: sortType
*         schema:
*           type: string
*         enum: [asc,desc]
*       - in: query
*         name: filter
*         schema:
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
* /admin/registeredUserList:
*   get:
*     tags:
*       - Admins
*     name: list of all customers for registration (Seller view)
*     summary: Get list of all customers for registration
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: sortBy
*         schema:
*           type: string
*         enum: [firstName,lastName,updatedOn,accountType,companyName,email,phoneNumber]
*       - in: query
*         name: sortType
*         schema:
*           type: string
*         enum: [asc,desc]
*       - in: query
*         name: filter
*         schema:
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
*     
*/

/**
* @swagger
* /admin/userDetails:
*   get:
*     tags:
*       - Admins
*     name: Get details of a particular company
*     summary: Get details of a particular company
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: selectedEmployeeId
*         schema:
*         required:
*           type: integer
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
* /admin/userStatus:
*   post:
*     tags:
*       - Admins
*     name: Approve or reject a company
*     summary: Approve or reject a company
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             decisionValue:
*               type: integer      
*               description: decisionValue (1 for approve, 2 for reject)
*             selectedEmployeeId:
*               type: integer
*               description: positionId will be null for free candidates
*             description:
*               type:string
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
/**
* @swagger
* /employee/updateActiveStatus:
*   put:
*     tags:
*       - Employees
*     name: Update active status of an employee
*     summary: Update active status of an employee (set an employee active/inactive)
*     security:
*       - bearerAuth: []
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
*             userId:
*               type: integer
*             userCompanyId:
*               type: integer
*           required: [userCompanyId,userId]
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
* /employee/setPrimaryContact:
*   put:
*     tags:
*       - Employees
*     name: Update primary contact
*     summary: Set this employee as primary contact which will be considered while sending emails and notifications
*     security:
*       - bearerAuth: []
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
*             userId:
*               type: integer
*             userCompanyId:
*               type: integer
*           required: [userCompanyId,userId]
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

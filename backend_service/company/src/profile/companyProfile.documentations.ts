/**
* @swagger
* /companyProfile/updatePreferences:
*   put:
*     tags:
*       - CompanyProfile
*     name: Update preferences of a company
*     summary: Update preferences of a company
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
*             isEllowRate:
*               type: boolean
*             userCompanyId:
*               type: integer
*           required: [userCompanyId,isEllowRate]
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
* /companyProfile/preferences:
*   get:
*     tags:
*       - CompanyProfile
*     name: Fetch preferences
*     summary: Api to fetch all preferences of a company
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: userCompanyId
*         schema:
*         type: string
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
* /companyProfile:
*   delete:
*     tags:
*       - CompanyProfile
*     name: Delete a company [Super Admin]
*     summary:  Delete a company [Super Admin] use key inActivate to soft delete and permanentDelete to remove permanently either one of key is required to delete
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
*             inActivate:
*               type: boolean
*             forceRemove:
*               type: boolean
*             permanentDelete:
*               type: boolean
*             userCompanyId:
*               type: integer
*           required: [userCompanyId]
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
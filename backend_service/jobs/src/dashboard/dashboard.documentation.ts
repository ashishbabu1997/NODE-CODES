/**
* @swagger
* /dashboard/counts:
*   get:
*     tags:
*       - Dashboard
*     name: Fetch all counts required for dashboard of hirer and admin
*     summary: Fetch all counts required for dashboard of hirer and admin
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
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
* /dashboard/upcomingInterviews:
*   get:
*     tags:
*       - Dashboard
*     name: Fetch upcoming interviews required for dashboard of hirer and admin
*     summary: Fetch upcoming interviews required for dashboard of hirer and admin
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
*         type: string
*         enum:  [name,positionName,assignedTo]
*       - in: query
*         name: sortType
*         schema:
*         type: string
*         enum: [asc,desc]
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
* /dashboard/activePositions:
*   get:
*     tags:
*       - Dashboard
*     name: Fetch active positions 
*     summary: Fetch all active positions required for dashboard of hirer and admin
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
*         type: string
*         enum:  [positionName,developerCount,companyName]
*       - in: query
*         name: sortType
*         schema:
*         type: string
*         enum: [asc,desc]
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

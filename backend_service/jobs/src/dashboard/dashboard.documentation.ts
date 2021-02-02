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
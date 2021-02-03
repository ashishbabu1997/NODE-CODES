/**
* @swagger
* /filter/position:
*   get:
*     tags:
*       - Filter
*     name: List all position filter
*     summary: Get list of all position filter values
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
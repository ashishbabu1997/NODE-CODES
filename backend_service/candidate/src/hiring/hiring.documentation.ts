/**
* @swagger
* /hiring/getPositionHiringSteps:
*   get:
*     tags:
*       - hiring
*     name: List position hiring steps
*     summary: list all position hiring steps
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: positionId
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
* /hiring/getCandidateHiringSteps:
*   get:
*     tags:
*       - hiring
*     name: List candidate hiring steps
*     summary: list all candidate hiring steps
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: candidateId
*         schema:
*         required:
*           type: integer
*       - in: query
*         name: positionId
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
* /hiring/defaultHiringSteps:
*   get:
*     tags:
*       - hiring
*     name: List candidate hiring steps
*     summary: list all default candidate hiring steps common to all
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




/**
* @swagger
* /hiring/getPositionHiringSteps:
*   get:
*     tags:
*       - Hiring
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
*       - Hiring
*     name: List candidate hiring steps
*     summary: list all candidate hiring steps for a given position
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
* /hiring/getAllCandidateHiringSteps:
*   get:
*     tags:
*       - Hiring
*     name: List All candidate hiring steps
*     summary: list all candidate hiring steps for all the positions the candidate is applied to
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
*       - Hiring
*     name: List default candidate hiring steps
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

/**
* @swagger
* /hiring/updateCandidateHiringDetails:
*   put:
*     tags:
*       - Hiring
*     name: Update candidate hiring details
*     summary:  Update candidate hiring details of a particular position
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
*             candidateClientHiringStepId:
*               type: integer
*             assignedTo:
*               type: integer
*             candidateHiringStepComment:
*               type: string
*             attachments:
*               type: array
*               items:
*                 type: string
*             stepLink:
*               type: string
*             stepLinkText:
*               type: string
*           required:
*             - candidateClientHiringStepId
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
* /hiring/moveCandidateHiringStep:
*   put:
*     tags:
*       - Hiring
*     name: Update candidate hiring details
*     summary:  Update candidate hiring details of a particular position
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
*             candidateClientHiringStepId:
*               type: integer
*             candidateHiringStepOrder:
*               type: integer
*             candidateId:
*               type: integer
*             candidateName:
*               type: string
*             assignedTo:
*               type: integer
*             positionId:
*               type: integer
*             hiringStepName:
*               type: string
*           required:
*             - candidateClientHiringStepId
*             - candidateId
*             - positionId
*             - assignedTo
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
* /hiring/rejectCandidateHiring:
*   put:
*     tags:
*       - Hiring
*     name: Reject candidate hiring 
*     summary:  Reject candidate from hiring process
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
*             candidateClientHiringStepId:
*               type: integer
*             assignedTo:
*               type: integer
*             candidateHiringStepComment:
*               type: string
*             attachments:
*               type: array
*               items:
*                 type: string
*             stepLink:
*               type: string
*             candidateName:
*               type: string
*             hiringStepName:
*               type: string
*             stepLinkText:
*               type: string
*             candidateId:
*               type: integer
*             positionId:
*               type: integer
*           required:
*             - candidateClientHiringStepId
*             - candidateId
*             - positionId
*             - hiringStepName
*             - candidateName
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
* /hiring/addNewStageForCandidate:
*   put:
*     tags:
*       - Hiring
*     name: Add a new stage
*     summary: Add a new hiring step for candidate under particular position
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
*             candidateHiringStepName:
*               type: string
*             candidateHiringStepType:
*               type: integer
*             candidateId:
*               type: integer
*             candidateName:
*               type: string
*             positionId:
*               type: integer
*           required:
*             - candidateHiringStepName
*             - candidateHiringStepType
*             - candidateId
*             - positionId
*             - candidateName
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
* /hiring/updateDefaultAssignee:
*   put:
*     tags:
*       - Hiring
*     name: Update default assignee
*     summary: Update default assignee for a candidate under a position
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
*             assignedTo:
*               type: integer
*             candidateId:
*               type: integer
*             positionId:
*               type: integer
*             candidateName:
*               type: string
*           required:
*             - assignedTo
*             - candidateId
*             - positionId
*             - candidateName
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
* /hiring/deletePositionHiringStep:
*   delete:
*     tags:
*       - Hiring
*     name: deletePositionHiringStep
*     summary:  delete a hiring step from given position
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         schema:
*           type: object
*           properties:
*             positionHiringStepId:
*               type: integer
*             positionHiringStepName:
*               type: string
*             positionName:
*               type: string
*           required:
*             - positionHiringStepId
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
* /hiring/reorderHiringSteps:
*   put:
*     tags:
*       - Hiring
*     name: reorderHiringSteps
*     summary:  reorder candidate hiring steps
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
*             hiringSteps:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   candidateHiringStepId:
*                     type: interger
*                   candidateHiringStepName:
*                     type: string
*           required:
*             - candidateHiringStepId
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

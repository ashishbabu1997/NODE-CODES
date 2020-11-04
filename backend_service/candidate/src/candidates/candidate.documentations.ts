/**
* @swagger
* /listCandidates:
*   get:
*     tags:
*       - Candidates
*     name: List position based candidates
*     summary: list all candidates under a specific position
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
*           type: integer
*       - in: query
*         name: sortBy
*         schema:
*           type: string
*         enum: [candidateFirstName,candidateLastName,rate,ellowRate,companyName]
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
* /listFreeCandidates:
*   get:
*     tags:
*       - Candidates
*     name: List available candidates
*     summary: list available candidates for applying against a position
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
*         enum: [candidateId,candidateFirstName,candidatelastName,email,phoneNumber,companyName]
*       - in: query
*         name: sortType
*         schema:
*           type: string
*         enum: [asc,desc]
*         example: asc
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
* /resume:
*   get:
*     tags:
*       - Candidates
*     name: Fetch resume data
*     summary: Fetch all the datas required for displaying resume
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
* /candidateApproveReject:
*   post:
*     tags:
*       - Candidates
*     name: Approve or Reject candidate (Ellow Recruiter)
*     summary: Approve or Reject candidate who is under a specific position
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
*             candidateId:
*               type: integer            
*             positionId:
*               type: integer
*             decisionValue:
*               type: integer
*             comment :
*               type: string 
*             ellowRate:
*               type: integer
*         required:
*           - candidateId
*           - positionId
*           - decisionValue
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
* /requestForInterview:
*   post:
*     tags:
*       - Candidates
*     name: Request For Interview
*     summary: Change candidate status to Interview Requested (changes value of make offer)
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
*             candidateId:
*               type: integer
*             positionId:
*               type: integer
*         required:
*           - candidateId
*           - positionId
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
* /review:
*   post:
*     tags:
*       - Candidates
*     name: Assesment Traits / Review
*     summary: Change candidate status to Interview Requested (changes value of make offer)
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
*             candidateId:
*               type: integer
*             assessmentTraits:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   candidateAssesmentId:
*                     type: integer
*                   rating:
*                     type: integer
*         required:
*           - candidateId
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
* /candidateVettingStatus:
*   put:
*     tags:
*       - Candidates
*     name: Change vetting status
*     summary: Change candidate vetting status
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
*             candidateId:
*               type: integer
*             candidateVetted:
*               type: integer
*         required:
*           - candidateId
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
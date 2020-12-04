/**
* @swagger
* /freelancer/fetchJobList:
*   get:
*     tags:
*       - Freelancer
*     name: List positions
*     summary: list all positions available
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: searchKey
*         schema:
*           type: string
*       - in: query
*         name: filterSkillId
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
* /freelancer/getCandidatePositionDetails:
*   get:
*     tags:
*       - Freelancer
*     name: List candidate position details
*     summary: list candidate positions details which he/she had applied
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     security:
*       - bearerAuth: []
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
* /freelancer/getCandidateStatuses:
*   get:
*     tags:
*       - Freelancer
*     name: List candidate status
*     summary: list candidate vetted and candidate status
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     security:
*       - bearerAuth: []
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
* /freelancer/updateGeneralInfo:
*   put:
*     tags:
*       - Freelancer
*     name: Modify general info
*     summary: Edit general info of a candidate
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
*             firstName:
*               type: string
*             lastName:
*               type: string
*             description:
*               type: string
*             image:
*               type: string
*             citizenship:
*               type: integer
*             residence:
*               type: integer
*             phoneNumber:
*               type: integer
*             email:
*               type: string
*             availability:
*               type: integer
*             typeOfAvailability:
*               type: integer
*             readyToStart:
*               type: boolean
*             workExperience:
*               type: number
*             remoteWorkExperience:
*               type: number
*             candidatePositionName:
*               type: string
*             cost:
*               type: number
*             billingTypeId:
*               type: integer
*             currencyTypeId:
*               type: integer
*           required:
*             - candidateId
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
* /freelancer/updateOtherInfoAndSubmit:
*   put:
*     tags:
*       - Freelancer
*     name: Update other info and finish profile
*     summary: Edit other info and finish profile
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
*             github:
*               type: boolean
*             githubLink:
*               type: string
*             linkedin:
*               type: boolean
*             linkedinLink:
*               type: string
*             stackoverflow:
*               type: boolean
*             stackoverflowLink:
*               type: string
*             cloudProficiency:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   cloudProficiencyId:
*                     type: integer
*                   cloudProficiencyName:
*                     type: string
*           required: [candidateId]
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
* /freelancer/submitFreelancerProfile:
*   put:
*     tags:
*       - Freelancer
*     name: Submit freelancer profile
*     summary: Submit freelancer profile
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
*           required: [candidateId]
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
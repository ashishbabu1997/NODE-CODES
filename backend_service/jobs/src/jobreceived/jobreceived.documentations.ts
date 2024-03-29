/**
* @swagger
* /jobreceived:
*   get:
*     tags:
*       - Jobreceieved
*     name: List all positions (Seller view)
*     summary: Get list of all positions available for a seller
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
*         type: integer
*         required: [positionId]
*       - in: query
*         name: sortBy
*         schema:
*         type: string
*         enum: [position,positionName,companyName,createdOn,candidateCount,resourceCount,duration,startDate]
*       - in: query
*         name: sortType
*         schema:
*         type: string
*         enum: [asc,desc]
*       - in: query
*         name: filter
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
* /jobreceived/getById:
*   get:
*     tags:
*       - Jobreceieved
*     name: Get a position detail
*     summary: Get position details by using jobreceived id
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
*         type: integer
*         required: [positionId]
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
* /jobreceived/profile:
*   get:
*     tags:
*       - Jobreceieved
*     name: List Candidates (seller)
*     summary: Get list of candidates uploaded by (seller) against a position
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
*         type: integer
*         required: [positionId]
*       - in: query
*         name: sortBy
*         schema:
*         type: string
*         enum: [candidateFirstName]
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
* /jobreceived/addProfile:
*   post:
*     tags:
*       - Jobreceieved
*     name: Add new candidate
*     summary: Add a new candidate against a position / free candidate (seller / ellow recruiter)
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
*             sellerCompanyId:
*               type: integer      
*               description: sellerCompanyId (null for provider, on behalf of companyId for ellow recruiter)
*             positionId:
*               type: integer
*               description: positionId will be null for free candidates
*             firstName:
*               type: string
*             lastName:
*               type: string
*             jobReceivedId:
*               type: integer 
*             description:
*               type: string
*             email:
*               type: string
*             phoneNumber:
*               type: integer
*             image:
*               type: string
*             citizenship:
*               type: integer
*             residence:
*               type: integer
*               description: currencyTypeId will be null for free candidates
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
* /jobreceived/reject:
*   put:
*     tags:
*       - Jobreceieved
*     name: Reject candidate
*     summary: Api used to reject a position (seller)
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
*             jobReceivedId:
*               type: integer
*             reject:
*               type: integer
*           required: [jobReceivedId]
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
* /jobreceived/submitProfile:
*   put:
*     tags:
*       - Jobreceieved
*     name: Submit Profile
*     summary: Submit a candidate profile after all the necessary details are updated (seller/ellow recruiter)
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
*               description: positionId will be null for free candidates
*             positionName:
*               type: string
*               description: positionName will be null for free candidates
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
* /jobreceived/editSkills:
*   put:
*     tags:
*       - Jobreceieved
*     name: Edit candidate skills
*     summary: Add or update candidate skills
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
*             candidateStatus:
*               type: integer
*               description: candidateStatus will be 3 for submitted candidates in which assesment traits will be updated based on comptency of skill
*             skills:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   competency:
*                     type: integer
*                   preferred:
*                     type: boolean
*                   skill:
*                     type: object
*                     properties:
*                       skillId:
*                         type: integer
*                   yoe:
*                     type: number
*                   skillVersion:
*                     type: string
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
* /jobreceived/addResumeBuilderProfile:
*   post:
*     tags:
*       - Jobreceieved
*     name: Add new candidate
*     summary: Add a new candidate against a position / free candidate (seller / ellow recruiter)
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
*             sellerCompanyId:
*               type: integer      
*               description: sellerCompanyId (null for provider, on behalf of companyId for ellow recruiter)
*             positionId:
*               type: integer
*               description: positionId will be null for free candidates
*             firstName:
*               type: string
*             lastName:
*               type: string
*             jobReceivedId:
*               type: integer 
*             description:
*               type: string
*             email:
*               type: string
*             phoneNumber:
*               type: integer
*             image:
*               type: string
*             citizenship:
*               type: integer
*             residence:
*               type: integer
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
*               description: currencyTypeId will be null for free candidates
*             availability:
*               type: integer
*             typeOfAvailability:
*               type: integer
*             readyToStart:
*               type: boolean
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

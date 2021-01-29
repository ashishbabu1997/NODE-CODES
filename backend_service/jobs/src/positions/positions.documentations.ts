/**
* @swagger
* /positions/positionList:
*   post:
*     tags:
*       - Positions
*     name: List position based candidates
*     summary: list all positions ellow recruiter / hirer
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
*         enum:  [position,positionName,createdOn,candidateCount,resourceCount,companyName,updatedOn]
*       - in: query
*         name: sortType
*         schema:
*         type: string
*         enum: [asc,desc]
*       - in: query
*         name: searchKey
*         schema:
*         type: string
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             company:
*               type: array
*               items:
*                 type: string
*             allocatedTo:
*               type: integer
*             jobCategory:
*               type: integer 
*             position:
*               type: array
*               items:
*                 type: string 
*             postedFrom:
*               type: integer            
*             postedTo:
*               type: integer
*             minDuration:
*               type: string            
*             maxDuration:
*               type: string
*             coreSkills:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   skillId:
*                     type: integer
*                   skillName:
*                     type: string
*             otherSkills:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   skillId:
*                     type: integer
*                   skillName:
*                     type: string
*             status:
*               type: array
*               items:
*                 type: string
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
* /positions/companyNames:
*   get:
*     tags:
*       - Positions
*     name: List company names
*     summary: list company name list (hirer / seller) used by ellow recruiter
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: accountType
*         schema:
*         type: integer
*         enum: [1,2]
*         description: 1 for hirerList, 2 for sellerList
*         required: [accountType]
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
* /positions/{positionId}:
*   get:
*     tags:
*       - Positions
*     name: Position details
*     summary: Get all the details of a position (does not include candidate details)
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: path
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
* /positions:
*   post:
*     tags:
*       - Positions
*     name: Create Position
*     summary: To add a new position (ellow recruiter / hirer)
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
*             positionName:
*               type: string            
*             locationName:
*               type: string
*             developerCount:
*               type: integer
*             positionCreatedCompanyId :
*               type: integer 
*             allowRemote:
*               type: boolean
*             experienceLevel:
*               type: integer            
*             jobDescription:
*               type: string
*             document:
*               type: string
*             contractStartDate :
*               type: integer 
*             contractDuration:
*               type: integer
*             currencyTypeId:
*               type: integer            
*             billingType:
*               type: integer
*             minBudget:
*               type: number
*             maxBudget :
*               type: number 
*             jobCategoryId:
*               type: integer
*             immediate:
*               type: boolean
*             skills:
*               type: object
*               properties:
*                 topRatedSkill:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       skillId:
*                         type: integer
*                       skillName:
*                         type: string
*                 otherSkill:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       skillId:
*                         type: integer
*                       skillName:
*                         type: string
*             hiringSteps:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   hiringStepName:
*                     type: string
*                   hiringStepType:
*                     type: integer
*                   hiringAssesmentName:
*                     type: string
*                   hiringAssesmentType:
*                     type: integer
*                   hiringStepOrder:
*                     type: integer
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
* /positions/publish:
*   post:
*     tags:
*       - Positions
*     name: Publish positions
*     summary: publish a given position by id (ellow recuiter / hirer)
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
*             positionId:
*               type: integer
*           required: [positionId]
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
* /positions/changePositionStatus:
*   post:
*     tags:
*       - Positions
*     name: Change Position Status
*     summary: change position status to close or reopen a position (ellow recuiter / hirer)
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
*             positionId:
*               type: integer
*             jobStatus:
*               type: integer
*               description: 6 for reopening, 8 for closing
*           required: [positionId,jobStatus]
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
* /positions/deletePosition:
*   post:
*     tags:
*       - Positions
*     name: deletePosition
*     description: deleted position and candidates under the position cannot be retrieved (use only in case of erroneus inputs)
*     summary: used to delete a position (hirer/ellow recruiter will no longer see the position deleted)
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
*             positionId:
*               type: integer
*               required:
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
* /positions:
*   put:
*     tags:
*       - Positions
*     name: updateCompanyPositions
*     summary: update details of a position
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
*             positionName:
*               type: string            
*             locationName:
*               type: string
*             developerCount:
*               type: integer
*             positionCreatedCompanyId :
*               type: integer 
*             allowRemote:
*               type: boolean
*             experienceLevel:
*               type: integer            
*             jobDescription:
*               type: string
*             document:
*               type: string
*             contractStartDate :
*               type: integer 
*             contractDuration:
*               type: integer
*             currencyTypeId:
*               type: integer            
*             billingType:
*               type: integer
*             minBudget:
*               type: number
*             maxBudget :
*               type: number 
*             jobCategoryId:
*               type: integer
*             immediate:
*               type: boolean
*             skills:
*               type: object
*               properties:
*                 topRatedSkill:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       skillId:
*                         type: integer
*                       skillName:
*                         type: string
*                 otherSkill:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       skillId:
*                         type: integer
*                       skillName:
*                         type: string
*             hiringSteps:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   hiringStepName:
*                     type: string
*                   hiringStepType:
*                     type: integer
*                   hiringAssesmentName:
*                     type: string
*                   hiringAssesmentType:
*                     type: integer
*                   hiringStepOrder:
*                     type: integer
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
* /positions/updateReadStatus:
*   put:
*     tags:
*       - Positions
*     name: updateReadStatus
*     summary: update read status of a position on row click
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
*             positionId:
*               type: integer
*           required: [positionId]
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
* /positions/updateAllocatedTo:
*   put:
*     tags:
*       - Positions
*     name: updateAllocatedTo
*     summary: update default allocation of a position
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
*             positionId:
*               type: integer
*             allocatedTo:
*               type: integer
*           required: [positionId,allocatedTo]
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


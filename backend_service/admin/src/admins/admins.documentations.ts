/**
* @swagger
* /listUsers:
*   get:
*     tags:
*       - Admins
*     name: list of all customers for registration (Seller view)
*     summary: Get list of all customers for registration
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
*         enum: [firstName,lastName,email,phoneNumber]
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
* /registeredUserList:
*   get:
*     tags:
*       - Admins
*     name: list of all customers for registration (Seller view)
*     summary: Get list of all customers for registration
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
*         enum: [firstName,lastName,updatedOn,accountType,companyName,email,phoneNumber]
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
*     
*/

/**
* @swagger
* /userDetails:
*   get:
*     tags:
*       - Admins
*     name: Get details of a particular company
*     summary: Get details of a particular company
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: selectedEmployeeId
*         schema:
*         type: integer
*         required: [selectedEmployeeId]
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
* /userStatus:
*   post:
*     tags:
*       - Admins
*     name: Approve or reject a company
*     summary: Approve or reject a company
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             decisionValue:
*               type: integer      
*               description: decisionValue (1 for approve, 2 for reject)
*             selectedEmployeeId:
*               type: integer
*               description: positionId will be null for free candidates
*             description:
*               type:string
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
* /addJobCategory:
*   post:
*     tags:
*       - Admins
*     name: Add new job category
*     summary: Add a new job category
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             jobCategoryName:
*               type: string
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
* /addSkills:
*   post:
*     tags:
*       - Admins
*     name: Add new skills
*     summary: Add multiple skills under a given job category
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             jobCategoryId:
*               type: integer
*             skill:
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
* /extractSkills:
*   post:
*     tags:
*       - Admins
*     name: Extract and upload skills to database
*     summary: Extract from excel file and upload skills to database
*     consumes:
*       - multipart/form-data
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: formData
*         name: file
*         type: file
*         description: Upload an excel file which contains skills data with sheet name as corresponding job category
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
* /allSkills:
*   get:
*     tags:
*       - Admins
*     name: Get all skills and job categories
*     summary: Get all skills and job categories for admin
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
* /updateJobCategoryName:
*   put:
*     tags:
*       - Admins
*     name: Update job category name
*     summary: Update job category name
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             jobCategoryId:
*               type: integer
*             jobCategoryName:
*               type: string
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
* /updateJobCategoryName:
*   put:
*     tags:
*       - Admins
*     name: Update job category name
*     summary: Update job category name
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             jobCategoryId:
*               type: integer
*             jobCategoryName:
*               type: string
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
* /udpateSkillName:
*   put:
*     tags:
*       - Admins
*     name: Update Skill name
*     summary: Update Skill name
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             skillId:
*               type: integer
*             skillname:
*               type: string
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
* /removeSkillsFromJobCategory:
*   put:
*     tags:
*       - Admins
*     name: Remove skills from a job category
*     summary: Remove certain skills from a job category
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             jobCategoryId:
*               type: integer
*             skillId:
*               type: array
*               items:
*                 type: integer
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
* /deleteJobCategory:
*   delete:
*     tags:
*       - Admins
*     name: Delete a job category
*     summary: Delete a job category will throw error in case the job_category is linked to some position or candidate, can be override with forceRemove key
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             jobCategoryId:
*               type: integer
*             forceRemove:
*               type: boolean
*               default: false
*               desciption: default false used only in case where job category needs to be force removed
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
* /deleteSkills:
*   delete:
*     tags:
*       - Admins
*     name: Delete a skill
*     summary: Delete skill will throw error in case the skill_id is linked to some position or candidate, can be overriden with forceRemove key
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         schema:
*           type: object
*           properties:
*             skillId:
*               type: integer
*             forceRemove:
*               type: boolean
*               default: false
*               desciption: default false used only in case where job category needs to be force removed
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




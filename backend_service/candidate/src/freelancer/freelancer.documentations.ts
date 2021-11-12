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
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: searchKey
 *         schema:
 *         type: string
 *       - in: query
 *         name: filterSkillId
 *         schema:
 *         type: integer
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
 * /freelancer/getCandidateStatuses:
 *   get:
 *     tags:
 *       - Freelancer
 *     name: List candidate status
 *     summary: list candidate vetted and candidate status
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
 *         type: integer
 *         required: [candidateId]
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

/**
 * @swagger
 * /freelancer/getDraftFreelancers:
 *   post:
 *     tags:
 *       - Candidates
 *     name: List draft freelancers
 *     summary: list available draft freelancers
 *     description: Filters <br><br> resourcesType - [ "Vetted Resources" / "Non-Vetted Resources" ] <br> skills - [ "Axios" , "Material-UI" ... ] <br> locations - ["Kochi, Kerala, India","Mahipalpur, New Delhi, Delhi, India"] <br> positionStatus - [ "Resource accepted offer" , "Make offer" ] <br> candidateStatus - [ "Vetted", "Rejected" , "Profile Screening Scheduled" ]
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
 *         enum: [candidateId,candidateFirstName,candidatelastName,companyName,updatedOn]
 *       - in: query
 *         name: sortType
 *         schema:
 *         type: string
 *         enum: [asc,desc]
 *         example: asc
 *       - in: query
 *         name: filter
 *         schema:
 *         type: string
 *       - in: query
 *         name: pageSize
 *         schema:
 *         type: integer
 *         enum: [10,20,50,100]
 *       - in: query
 *         name: pageNumber
 *         schema:
 *         type: integer
 *         enum: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             filter:
 *               type: object
 *               properties:
 *                 resourcesType:
 *                   type: array
 *                   items:
 *                     type: string
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       skillId:
 *                         type: integer
 *                       skillName:
 *                         type: string
 *                 otherSkills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       skillId:
 *                         type: integer
 *                       skillName:
 *                         type: string
 *                 experience:
 *                   type: object
 *                   properties:
 *                     min:
 *                       type: integer
 *                     max:
 *                       type: integer
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: string
 *                 fromDate:
 *                   type: integer
 *                 toDate:
 *                   type: integer
 *                 minCost:
 *                   type: integer
 *                 maxCost:
 *                   type: integer
 *                 billingTypeId:
 *                   type: integer
 *                 currencyType:
 *                   type: integer
 *                 availability:
 *                   type: integer
 *                 allocatedTo:
 *                   type: integer
 *                 positionStatus:
 *                   type: array
 *                   items:
 *                     type: string
 *                 candidateStatus:
 *                   type: array
 *                   items:
 *                     type: string
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
 * /freelancer/getFreelancerContractDetails:
 *   get:
 *     tags:
 *       - Freelancer
 *     name: getFreelancerContractDetails
 *     summary: Get freelancer contract details
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
 * /freelancer/freelancerAppliedJobs:
 *   get:
 *     tags:
 *       - Freelancer
 *     name: freelancerAppliedJobs
 *     summary: Get freelancer applied jobs
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
 * /freelancer/getCandidateAssesmentLink:
 *   get:
 *     tags:
 *       - Freelancer
 *     name: getCandidateAssesmentLink
 *     summary: Get candidate assessment test links
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

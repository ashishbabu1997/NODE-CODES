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
*         required:
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
*           required:
*             - candidateId
*             - positionId
*             - decisionValue
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
*           required:
*             - candidateId
*             - positionId
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
* /candidateVettingStatus:
*   put:
*     tags:
*       - Candidates
*     name: Change vetting status
*     summary: Change candidate vetting status
*     description:  candidateVetted [0 - rejected ,1 - vetted ,null - nonvetted]
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
* /linkCandidateToPosition:
*   put:
*     tags:
*       - Candidates
*     name: Link to position
*     summary: Add a candidate to a given open position
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
*             candidates:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   candidateId:
*                     type: integer
*                   sellerFee:
*                     type: number
*           required:
*             - positionId
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
* /updateLanguageProficiency:
*   put:
*     tags:
*       - Candidates
*     name: Change vetting status
*     description:  action ['add' ,'update' ,'delete']
*     summary: Add or edit language proficiency of a candidate
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
*             candidateLanguageId:
*               type: integer
*             proficiency:
*               type: integer
*             languageName:
*               type: string
*             action:
*               type: string
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
* /updateAvailability:
*   put:
*     tags:
*       - Candidates
*     name: Updae availability
*     summary: Edit availability of joining of a candidate
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
*             availability:
*               type: integer
*             typeOfAvailability:
*               type: integer
*             readyToStart:
*               type: boolean
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
* /updateProfileDetails:
*   put:
*     tags:
*       - Candidates
*     name: Modify profile details
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
* /updateProject:
*   put:
*     tags:
*       - Candidates
*     name: Modify candidate projects
*     description:  action ['add' ,'update' ,'delete']
*     summary: Add or edit existing candidate project details
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
*             candidateProjectId:
*               type: integer
*             projectName:
*               type: string
*             companyName:
*               type: string
*             projectDescription:
*               type: string
*             projectLink:
*               type: string
*             extraProject:
*               type: boolean
*             skills:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   skillId:
*                     type: integer
*                   skillName:
*                     type: string
*             action:
*               type: string
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
* /updateWorkExperience:
*   put:
*     tags:
*       - Candidates
*     name: Update work experience
*     description:  action ['add' ,'update' ,'delete']
*     summary: Add or edit existing work history details
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
*             candidateWorkExperienceId:
*               type: integer
*             positionName:
*               type: string
*             companyName:
*               type: string
*             description:
*               type: string
*             logo:
*               type: string
*             startDate:
*               type: integer
*             endDate:
*               type: integer
*             stillWorking:
*               type: boolean
*             action:
*               type: string
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
* /updateEducation:
*   put:
*     tags:
*       - Candidates
*     name: Update education
*     description:  action ['add' ,'update' ,'delete']
*     summary: Add or edit candidate education details
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
*             candidateEducationId:
*               type: integer
*             degree:
*               type: string
*             college:
*               type: string
*             startDate:
*               type: integer
*             endDate:
*               type: integer
*             action:
*               type: string
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
* /updateAward:
*   put:
*     tags:
*       - Candidates
*     name: Update awards and certifications
*     description:  action ['add' ,'update' ,'delete']
*     summary: Add or edit awards and certifications details
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
*             certificationId:
*               type: string
*             certifiedYear:
*               type: integer
*             candidateAwardId:
*               type: integer
*             action:
*               type: string
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
* /updateSocialAndCloud:
*   put:
*     tags:
*       - Candidates
*     name: Update social profile and cloud proficiency
*     summary: Edit social profile and cloud proficiency
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
*             githubId:
*               type: integer
*             stackoverflowId:
*               type: integer
*             kaggleId:
*               type: integer
*             linkedInId:
*               type: integer
*             cloudProficiency:
*               type: object
*               properties:
*                 IBM:
*                   type:boolean
*                 Oracle:
*                   type:boolean
*                 Azure:
*                   type:boolean
*                 AWS:
*                   type:boolean
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
* /updatePublication:
*   put:
*     tags:
*       - Candidates
*     name: Update publication
*     summary: Add or edit publication details
*     description: action ['add' ,'update' ,'delete']
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - name: body
*         in: body
*         description:  
*         schema:
*           type: object
*           properties:
*             candidateId:
*               type: integer
*             candidatePublicationId:
*               type: integer
*             title:
*               type: string
*             publishedYear:
*               type: integer
*             link:
*               type: string
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
* /updateResumeFile:
*   put:
*     tags:
*       - Candidates
*     name: Update resume file
*     summary: Update resume file filename
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
*             resume:
*               type: string
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
* /updateOverallWorkExperience:
*   put:
*     tags:
*       - Candidates
*     name: Update workExperience
*     summary:  Update work experience
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
* /:
*   delete:
*     tags:
*       - Candidates
*     name: deleteCandidateFromPosition
*     summary:  delete a candidate from a position
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
*           required:
*             - candidateId
*             - positionId
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
* /deleteCandidate:
*   delete:
*     tags:
*       - Candidates
*     name: deleteCandidate
*     summary:  delete a candidate user views
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
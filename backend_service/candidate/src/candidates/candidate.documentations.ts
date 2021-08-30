/**
* @swagger
* /candidates/listCandidates:
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
*         type: integer
*         required: [positionId]
*       - in: query
*         name: sortBy
*         schema:
*         type: string
*         enum: [candidateFirstName,candidateLastName,rate,ellowRate,companyName]
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
* /candidates/getAssementOfCandidate:
*   get:
*     tags:
*       - Candidates
*     name: Get candidate Assessment
*     summary: Get candidate assessments
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
* /candidates/resume:
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
* /candidates/getSharedEmailsForPdf:
*   get:
*     tags:
*       - Candidates
*     name: Fetch shared emails
*     summary: Fetch emails for shared resume as pdf for a candidate
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
* /candidates/sharedResumePdfData:
*   get:
*     tags:
*       - Candidates
*     name: Fetch shared pdf data
*     summary: Fetch data for pdf generation
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: uniqueId
*         schema:
*         type: string
*         required: [uniqueId]
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
* /candidates/sharedResumeData:
*   get:
*     tags:
*       - Candidates
*     name: Fetch resume data
*     summary: Fetch all the datas required for displaying shared resume
*     consumes:
*       - application/json
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: token
*         schema:
*         type: string
*         required: [token]
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
* /candidates/initialSharedResumeData:
*   get:
*     tags:
*       - Candidates
*     name: Fetch resume data
*     summary: Fetch few details for displaying shared resume
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: token
*         schema:
*         type: string
*         required: [token]
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
* /candidates/resumeSharedEmails:
*   get:
*     tags:
*       - Candidates
*     name: Fetch emails shared for a resume
*     summary: Fetch all emails the resume have been shared to
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
* /candidates/listForAddFromListCandidates:
*   post:
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
*         name: positionId
*         schema:
*         type: integer
*         required: [positionId]
*       - in: query
*         name: sortBy
*         schema:
*         type: string
*         enum: [candidateId,candidateFirstName,candidatelastName,email,phoneNumber,companyName,updatedOn]
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
* /candidates/listFreeCandidates:
*   post:
*     tags:
*       - Candidates
*     name: List available candidates
*     summary: list available candidates for applying against a position
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
* /candidates/listFreeCandidatesOfHirer:
*   post:
*     tags:
*       - Candidates
*     name: List available candidates of Hirer
*     summary: list available candidates for applying against a position
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
*         name: pageSize
*         schema:
*         type: integer
*         enum: [10,20,50,100]
*       - in: query
*         name: pageNumber
*         schema:
*         type: integer
*         enum: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
*       - in: query
*         name: filter
*         schema:
*         type: string
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
* /candidates/updateCandidateAvailability:
*   post:
*     tags:
*       - Candidates
*     name: update Candidate Availability
*     summary: update availability value of a candidate
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
*               type: boolean
*           required:
*             - candidateId
*             - availability
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
* /candidates/resumeShareLink:
*   post:
*     tags:
*       - Candidates
*     name: Share resume link
*     summary: Generate a sharable link for resumes for shared emails.
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
*             sharedEmails:
*               type: array
*               items:
*                 type: string
*           required:
*             - candidateId
*             - sharedEmails
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
* /candidates/resumeParser:
*   post:
*     tags:
*       - Candidates
*     name: Parse resume and extract data
*     summary: Parse resume and extract data
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
*             publicUrl:
*               type: string
*             fileName:
*               type: string
*           required:
*             - publicUrl
*             - fileName
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
* /candidates/candidateApproveReject:
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
*               type: number
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
* /candidates/requestForInterview:
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
*           required: [candidateId,positionId]
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
* /candidates/review:
*   post:
*     tags:
*       - Candidates
*     name: Assesment Traits / Review
*     summary: To add details regarding ellow recuiters assessment of a candidate
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
*             candidateAssessmentId:
*               type: integer
*             assessmentComment:
*               type: string
*             assessmentLink:
*               type: string
*             assessmentLinkText:
*               type: string
*             attachments:
*               type: array
*               items:
*                 type: string
*             rating:
*               type: integer
*             assignedTo:
*               type: integer
*             asigneeName:
*               type: string
*             stageName:
*               type: string
*             reviewStepsId:
*               type: integer
*           required:
*             - candidateAssessmentId
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
* /candidates/sharePdf:
*   put:
*     tags:
*       - Candidates
*     name: Share pdf data
*     summary: Generate a pdf from candidate details for given candidate and send mail to recipients with pdf attachments
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
*             emailList:
*               type: array
*               items:
*                 type: string
*             host:
*               type: string
*           required:
*             - candidateId
*             - sharedEmails
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
* /candidates/candidateVettingStatus:
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
* /candidates/linkCandidateToPosition:
*   put:
*     tags:
*       - Candidates
*     name: Link to position
*     summary: Add a candidate to a given open position
*     description: For ellow recruiter,candidates array consists of candidateId,ellowrate,billingtypeid,currencytypeid,admincomment. For other users, candidates rray consists of only candidateId
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
*                   ellowRate:
*                     type: integer
*                   currencyTypeId:
*                     type: integer
*                   billingTypeId:
*                     type: integer
*                   adminComment:
*                     type: string
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
* /candidates/updateLanguageProficiency:
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
*             languageId:
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
* /candidates/updateAvailability:
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
* /candidates/updateProfileDetails:
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
* /candidates/updateProject:
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
* /candidates/updateWorkExperience:
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
* /candidates/updateEducation:
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
* /candidates/updateAward:
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
* /candidates/updateSkill:
*   put:
*     tags:
*       - Candidates
*     name: Update skills
*     description:  action ['add' ,'update' ,'delete']
*     summary: Add or edit candidate skill details
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
*             candidateSkillId:
*               type: integer
*             skill:
*               type: object
*               properties:
*                 skillId:
*                   type: integer
*             yoe:
*               type: number
*             skillVersion:
*               type: string
*             competency:
*               type: number
*             preferred:
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
* /candidates/updateSocialProfile:
*   put:
*     tags:
*       - Candidates
*     name: Update social profile
*     summary: Edit social profile details of a candidate
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
* /candidates/updateCloudProficiency:
*   put:
*     tags:
*       - Candidates
*     name: Update cloud proficiency
*     summary: Edit cloud proficiency of a candidate
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
* /candidates/updatePublication:
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
* /candidates/userSignup:
*   post:
*     tags:
*       - Candidates
*     name: New user signup
*     description:  user signup using resume share
*     summary: new user signsup using resume share link
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
*             firstName:
*               type: string
*             lastName:
*               type: string
*             email:
*               type: string
*             telephoneNumber:
*               type: string
*             token:
*               type: string
*           required: [email,firstName,token]
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
* /candidates/updateBlacklisted:
*   post:
*     tags:
*       - Candidates
*     name: Blacklist or un-blacklist a candidate
*     summary: Blacklist or un-blacklist a candidate
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
* /candidates/updateAssesmentLinkAndStatus:
*   put:
*     tags:
*       - Candidates
*     name: Update assessment links and status
*     description:  type ('codeTest','interviewTest') when type is codeTest interviewTestLink & interviewTestStatus is not required and vice versa
*     summary: Edit candidate assesment links and test realted status
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
*             type:
*               type: string
*               description: codeTest or interviewTest
*             link:
*               type: string
*             status:
*               type: integer
*               description: by default will be null.For codeTest,status will be 1.For interview test,it will be 1-scheduled,2-completed
*           required: [candidateId,type]
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
* /candidates/updateResumeFile:
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
* /candidates/updateOverallWorkExperience:
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
* /candidates/changeCandidateAssignee:
*   put:
*     tags:
*       - Candidates
*     name: Update assginee
*     summary:  Change default assignee of a candidate
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
*             assignedTo:
*               type: integer
*             assigneeId:
*               type: integer
*             candidateName:
*               type: string
*           required:
*             - candidateId
*             - assigneeId
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
* /candidates/updateCandidateEllowStage:
*   put:
*     tags:
*       - Candidates
*     name: Move ellow hiring stage
*     summary:  Move a candidate between ellow hiring steps
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
*             stageName:
*               type: string
*             candidateAssessmentId:
*               type: integer
*             assigneeName:
*               type: string
*             candidateName:
*               type: string
*             reviewStepsId:
*               type: integer
*           required:
*             - candidateId
*             - stageName
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
* /candidates/rejectCandidateEllowStage:
*   put:
*     tags:
*       - Candidates
*     name: Reject candidate from ellow recuitment
*     summary:  Reject a candidate from any of ellow hiring stages
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
*             candidateAssessmentId:
*               type: integer
*             assessmentComment:
*               type: string
*             assessmentRating:
*               type: integer
*             assessmentLink:
*               type: string
*             assessmentLinkText:
*               type: string
*             assignedTo:
*               type: integer
*             stageName:
*               type: string
*             assigneeName:
*               type: string
*             candidateName:
*               type: string
*             reviewStepsId:
*               type: integer
*           required:
*             - candidateAssessmentId
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
* /candidates/:
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
* /candidates/deleteCandidate:
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


/**
* @swagger
* /candidates/getAllAuditLogs:
*   get:
*     tags:
*       - Candidates
*     name: List all audit logs
*     summary: list all logs from audit_log table from database
*     consumes:
*       - application/json
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
* /candidates/getEmployeeDetailsFromLinkedinToken:
*   post:
*     tags:
*       - Candidates
*     name: List employee details
*     summary: list employee details from token
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
*             token:
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
* /candidates/providerCandidateResume:
*   get:
*     tags:
*       - Candidates
*     name: Fetch provider resume data
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
* /candidates/updateProviderCandidateDetails:
*   put:
*     tags:
*       - Candidates
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
*             candidatePositionName:
*               type: string
*             cost:
*               type: number
*             billingTypeId:
*               type: integer
*             jobCategoryId:
*               type: integer
*             currencyTypeId:
*               type: integer
*             locationName:
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
* /candidates/updateProviderCandidateEllowRate:
*   put:
*     tags:
*       - Candidates
*     name: Link to position
*     summary: Add a candidate to a given open position
*     description: For ellow recruiter,candidates array consists of candidateId,ellowrate,billingtypeid,currencytypeid,admincomment. For other users, candidates rray consists of only candidateId
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
*             candidateId:
*               type: integer
*             ellowRate:
*               type: integer
*             currencyTypeId:
*               type: integer
*             billingTypeId:
*               type: integer
*             adminComment:
*               type: integer
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
* /candidates/approveCandidate:
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
*       - in: body
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
* /candidates/shareAppliedCandidate:
*   put:
*     tags:
*       - Candidates
*     name: Share applied candidates data
*     summary: Share details of candidates applied for a particular position along with their resume attached.
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
*             sharedEmails:
*               type: array
*               items:
*                 type: string
*             host:
*               type: string
*             positionId:
*               type: string
*             ellowRate:
*               type: integer
*             billingTypeId:
*               type: integer
*             currencyTypeId:
*               type: integer
*           required:
*             - candidateId
*             - sharedEmails
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
* /candidates/requestForScreening:
*   get:
*     tags:
*       - Candidates
*     name: Freelancer request for screening
*     summary: Button for all freelancers for requesting for screening after submitting thier profile
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
* /candidates/sentFreelancerLoginCredentials:
*   post:
*     tags:
*       - Candidates
*     name: sent Freelancer Login Credentials
*     summary: sent Freelancer Login Credentials
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


/**
* @swagger
* /candidates/fileDownload:
*   post:
*     tags:
*       - Candidates
*     name: download pdf data
*     summary: Download pdf format of a candidate's ellow resume
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
*             host:
*               type: string
*           required:
*             - candidateId
*             - host
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
* /candidates/approveOrRejectAppliedCandidate:
*   post:
*     tags:
*       - Candidates
*     name: Reject or Schedule Interview
*     summary: Reject or schedule an interview for a candidate who have applied for a particular position
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
*             token:
*               type: string
*             status:
*               type: integer
*           required:
*             - token
*             - status
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
* /candidates/checkAction:
*   post:
*     tags:
*       - Candidates
*     name: Check Action Taken
*     summary: Check action is already taken for reject and schedule interview for candidates applied to a position
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
*             token:
*               type: string
*           required:
*             - token
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
/**
* @swagger
* /listNotifications:
*   get:
*     tags:
*       - Notifications
*     name: List all notifications (Ellow recruiter)
*     summary: Get list all notifications (Ellow recruiter)
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

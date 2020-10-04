#!/bin/bash
pwd
NODE_PATH=/DEV/devops/BE/codedeploy/backend_service
cd $NODE_PATH/admin
npm run preprod 
sleep 3
cd $NODE_PATH/auth
npm run preprod 
sleep 3 
cd $NODE_PATH/company 
npm run preprod
sleep 3 
cd $NODE_PATH/employee
npm run preprod 
sleep 3 
cd $NODE_PATH/jobs 
npm run preprod
sleep 3  
cd $NODE_PATH/settings
npm run preprod
sleep 3 
cd $NODE_PATH/candidate
npm run preprod
sleep 3
pm2 start admin auth candidate company employee jobs settings 
sleep 3
ps -ef |grep /DEV/devops/BE/codedeploy/backend_service/ |grep -v grep
sleep 3
netstat -nlpt |grep :400[0-7]
sleep 3
exit

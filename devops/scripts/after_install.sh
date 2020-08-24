#!/bin/bash
pwd

NODE_PATH=/DEV/devops/BE/codedeploy
cd $NODE_PATH/backend_service/auth
npm insatll
sleep 30                   
cd $NODE_PATH/backend_service/company 
npm insatll
sleep 30                   
cd $NODE_PATH/backend_service/employee
npm insatll                   
sleep 30
cd $NODE_PATH/backend_service/jobs
npm insatll                   
sleep 30
cd $NODE_PATH/backend_service/settings
npm insatll                   
sleep 30
cd $NODE_PATH/backend_service/candidate
npm insatll
sleep 30

NODE_PATH=/DEV/devops/BE/codedeploy
cd $NODE_PATH/backend_service/auth && ls -l
cd $NODE_PATH/backend_service/company && ls -l
cd $NODE_PATH/backend_service/employee && ls -l
cd $NODE_PATH/backend_service/jobs && ls -l
cd $NODE_PATH/backend_service/settings && ls -l
cd $NODE_PATH/backend_service/candidate && ls -l

#!/bin/bash
pwd
NODE_PATH=/DEV/devops/BE/codedeploy/backend_service
cd $NODE_PATH/admin  && npm install && sleep 5
cd $NODE_PATH/auth && npm install && sleep 5  
cd $NODE_PATH/candidate  && npm install && sleep 5                 
cd $NODE_PATH/company && npm install && sleep 5 
cd $NODE_PATH/employee && npm install && sleep 5 
cd $NODE_PATH/jobs && npm install && sleep 5
cd $NODE_PATH/settings  && npm install && sleep 5
ls -l $NODE_PATH/admin
ls -l $NODE_PATH/auth
ls -l $NODE_PATH/company
ls -l $NODE_PATH/employee
ls -l $NODE_PATH/jobs
ls -l $NODE_PATH/settings
ls -l $NODE_PATH/candidate

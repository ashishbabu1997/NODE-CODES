#!/bin/bash
pwd
NODE_PATH=/DEV/devops/BE/codedeploy/backend_service
cd $NODE_PATH/auth && npm install && sleep 10                   
cd $NODE_PATH/company && npm install && sleep 10  
cd $NODE_PATH/employee && npm install && sleep 10 
cd $NODE_PATH/jobs && npm install && sleep 10 
cd $NODE_PATH/settings  && npm install && sleep 10 
cd $NODE_PATH/candidate  && npm install && sleep 10 
cd $NODE_PATH/auth && ls -l
cd $NODE_PATH/company && ls -l
cd $NODE_PATH/employee && ls -l
cd $NODE_PATH/jobs && ls -l
cd $NODE_PATH/settings && ls -l
cd $NODE_PATH/candidate && ls -l

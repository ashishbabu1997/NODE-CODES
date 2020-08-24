#!/bin/bash
pwd
NODE_PATH=/DEV/devops/BE/codedeploy
cd $NODE_PATH/backend_service/auth && npm run prod && npm run prod && npm run prod && sleep 10 
cd $NODE_PATH/backend_service/company && npm run prod && npm run prod && npm run prod && sleep 10 
cd $NODE_PATH/backend_service/employee && npm run prod && npm run prod && npm run prod && sleep 10 
cd $NODE_PATH/backend_service/jobs && npm run prod && npm run prod && npm run prod && sleep 10 
cd $NODE_PATH/backend_service/settings && npm run prod && npm run prod && npm run prod && sleep 10 
cd $NODE_PATH/backend_service/candidate && npm run prod && npm run prod && npm run prod && sleep 10 
netstat -nlpt |grep :400[0-5]

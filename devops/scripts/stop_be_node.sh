#!/bin/bash
NODE_PATH=/DEV/devops/BE/codedeploy
ls -l $NODE_PATH
pwd
echo "netstat -nlpt |grep :400[0-5]"
netstat -nlpt |grep :400[0-5]
# stop BE node services running on 4000 , 4001, 4002, 4003, 4004 and 40005
echo "/usr/local/bin/pm2 stop default"
/usr/local/bin/pm2 stop default
echo "netstat -nlpt |grep :400[0-5]"
netstat -nlpt |grep :400[0-5]
rm -rf $NODE_PATH
	
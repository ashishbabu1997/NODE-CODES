#!/bin/bash
NODE_HOME=/DEV/devops/BE/codedeploy
STAGE_PATH=/DEV/devops/BE/codedeploy/stagelocation
rm -rf $NODE_HOME/*
cp STAGE_PATH/node_devops.zip $NODE_HOME/
cd $NODE_HOME
unzip node_devops.zip
rm -rf node_devops.zip
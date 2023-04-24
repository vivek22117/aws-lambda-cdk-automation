#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3DynamodbCdkStack } from '../lib/s3-dynamodb-cdk-stack';
import { CDKContext } from "../types";

const createStacks = async () => {
    try {
        const app = new cdk.App();
        const context = await getContext(app);

        const tags: any = {
            Environment: context.environment,
        };

        const stackProps: cdk.StackProps = {
            env: {
                region: context.region,
            },
            stackName: `${context.appName}-stack-${context.environment}`,
            description: `This stack will deploy S3 and DynamoDB table`,
            tags,
        };

        new S3DynamodbCdkStack(app, `${context.appName}-stack-${context.environment}`, stackProps, context)
    } catch (error) {
        console.log(error);
    }
};

// Get CDK Context based on git branch
export const getContext = async (app: cdk.App): Promise<CDKContext> => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentBranch = 'master';
            console.log(`current git branch is: ${currentBranch}`);

            const environment = app.node.tryGetContext('environments').find((e: any) => e.branchName === currentBranch);
            console.log(`Environment: `);
            console.log(JSON.stringify(environment, null, 2));

            const globals = app.node.tryGetContext('globals');
            console.log(`Globals: `);
            console.log(JSON.stringify(globals, null, 2));

            return resolve({...globals, ...environment});
        } catch (error) {
            console.error(error);
            return reject();
        }
    });
};

createStacks();
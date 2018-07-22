import {CONFIG} from './config'
import AWS from 'aws-sdk'

AWS.config.region = CONFIG.Region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: CONFIG.CognitoIdentityPool});

let docClient = new AWS.DynamoDB.DocumentClient({
  region: CONFIG.Region
});

export function getUserInfo(data) {
  const params = {
    TableName: CONFIG.DDBUserTable,
    Key: {
      "userId": data,
      "status": 'active'
    }
  };
  
  let promise = new Promise((resolve, reject) => {
    docClient.get(params).promise().then((data) => {
      // console.log('getInfo', data);
      resolve(data.Item);
    }).catch((err) => {
      reject(err);
    });
  });

  return promise;
}

export function saveRobinhoodUser(userId, email, password, callback) {
  let params = {
      TableName: CONFIG.DDBUserTable,
      Item:{
          "userId": userId,
          "email": email,
          "password": password,      
          "status": 'active',
          "created": Math.floor(new Date().getTime() / 1000),
      }
  };
  
  return docClient.put(params, callback);
}

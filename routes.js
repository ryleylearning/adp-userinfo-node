/*
Copyright © 2015-2016 ADP, LLC.

Licensed under the Apache License, Version 2.0 (the “License”);
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an “AS IS” BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.  See the License for the specific language
governing permissions and limitations under the License.
*/

'use strict';

var express = require('express');
var router = express.Router();
var log = require('winston');
var adp = require('adp-connection');
var ConnectionFactory = adp.ADPAPIConnectionFactory;
var AuthorizationCodeConnType = adp.AuthorizationCodeConnType;
var UserInfoHelper = require('./index');

router.get('/callback', function callback(req, res){

	var connectionFactory = new ConnectionFactory();
	var connType = new AuthorizationCodeConnType();
	var initObject = {
		clientId: 'ec762f06-7410-4f6d-aa82-969902c1836a',
		clientSecret: '6daf2cd7-4604-46c0-ab43-a645a6571d34',
		apiUrl: 'https://iat-api.adp.com',
		tokenUrl: 'https://iat-api.adp.com/auth/oauth/v2/token',
		authorizationUrl: 'https://iat-accounts.adp.com/auth/oauth/v2/authorize',
		sslKeyPath: 'iatCerts/apiclient_iat.key',
		sslCertPath: 'iatCerts/apiclient_iat.pem',
		callbackUrl: 'http://localhost:8889/callback',
		authorizationCode: req.query.code
	};
	connType.init(initObject);

	var connection = connectionFactory.createConnection('authorization_code');
	connection.init(connType);
	connection.connect(null, function connectCb(err) {
		if(err) {
			res.send('Not Connected');
		}else{
			var userInfoHelper = new UserInfoHelper(connection);
			userInfoHelper.getUserInfo({}, function getUserInfoCb(err2, data){
				if(err2) {
					res.send('Error getting user info.');
				} else {
					res.send(data);
				}
				res.end();
			});
		}
	});
});

router.get('/authenticate', function login(req, res) {
	var connType = new AuthorizationCodeConnType();
	var initObject = {
		clientId: 'ec762f06-7410-4f6d-aa82-969902c1836a',
		clientSecret: '6daf2cd7-4604-46c0-ab43-a645a6571d34',
		apiUrl: 'https://iat-api.adp.com',
		tokenUrl: 'https://iat-api.adp.com/auth/oauth/v2/token',
		authorizationUrl: 'https://iat-accounts.adp.com/auth/oauth/v2/authorize',
		sslKeyPath: 'iatCerts/iat.key',
		sslCertPath: 'iatCerts/iat.pem',
		callbackUrl: 'http://localhost:8889/callback'
	};
	connType.init(initObject);
	var connectionFactory = new ConnectionFactory();
	var connection = connectionFactory.createConnection('authorization_code');
	connection.init(connType);
	var url = connection.getAuthorizationRequest();
	log.info('Redirecting: ' + url);
	res.redirect(url);
});

module.exports = router;

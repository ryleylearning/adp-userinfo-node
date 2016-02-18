'use strict';
require('chai').should();

var UserInfoHelper = require('../lib/userInfoHelper');
var connection = {
	connType: {
		apiUrl: 'https://iat-api.adp.com',
		sslCertPath: 'test/test.pem',
		sslKeyPath: 'test/test.key'
	},
	accessToken: 'something'
};

describe('userInfoHelper module tests', function describeCb(){

	it('Should call get User info. ', function itCb(done) {
		var userInfoHelper = new UserInfoHelper(connection);
		userInfoHelper.getUserInfo(null, function getUserInfoCb(err, data){
			(err === null).should.equal(false);
			done();
		})
	});
});
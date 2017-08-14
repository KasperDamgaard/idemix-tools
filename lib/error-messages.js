/* jshint strict: true, node: true */

'use strict';

var messages = {};
var lang = 'en';

messages = {
	en: {
			//Service messages
			"IDMXSVC0000E":"Internal Server Error. ",
			"IDMXSVC0001E":"There are no required parameters",
			"IDMXSVC0002E":"Authentication error. Please check credentials",
			"IDMXSVC0003E":"Success callback url and failure callback url must be specified",
			"IDMXSVC0004E":"Session id is not provided",
			"IDMXSVC0005E":"Issuance Problem. Error during getting policy",
			"IDMXSVC0006E":"Session id is wrong!",
			"IDMXSVC0007E":"Issuance Problem. Error during getting credential specification",
			"IDMXSVC0008E":"Issuance Problem. Error during issuance init",
			"IDMXSVC0009E":"Issuance Problem. Error during issuance steps",
			"IDMXSVC0010E":"Issuance Problem. No answer from 'nextissuancemessage' endpoint!",
			"IDMXSVC0011E":"Presentation Problem. Error during getting policy",
			"IDMXSVC0012E":"Presentation Problem. Error during getting nonce",
			"IDMXSVC0013E":"Presentation Problem. Error during token verification",
			"IDMXSVC0014E":"Presentation Problem. Error during matching",
			"IDMXSVC0015E":"Callback url and verifier identity url must be specified",
			"IDMXSVC0016E":"Instance identifier is not found",

			//Setup messages
			"IDMXSSP0001E":"Credential Specifications were not found!",
			"IDMXSSP0002E":"Somebody is already finished with setup",
			"IDMXSSP0003E":"No answer from '/parameters/issuer' endpoint!",
			"IDMXSSP0004E":"No answer from 'pushCredSpec' endpoint!",
			"IDMXSSP0005E":"No answer from 'pushPolicyIssuance' endpoint!",
			"IDMXSSP0006E":"No answer from 'pushMappings' endpoint!",
			"IDMXSSP0007E":"No answer from '/parameters/issuer' endpoint!",
			"IDMXSSP0008E":"Issuance Problem. Error during getting credential specification",
			"IDMXSSP0009E":"Get Token Endpoint call: ",
			"IDMXSSP0010E":"Get Auth Endpoint call: ",
			"IDMXSSP0011E":"Call oauth/token endpoint: ",
			"IDMXSSP0012E":"You are not authorized to manage this service instance",
			"IDMXSSP0013E":"There is no provisioned instance with id: ",
			"IDMXSSP0014E":"Somebody is already doing a setup ",
			"IDMXSSP0015E":"Some required parameters are missing. Please check your input data!",
			"IDMXSSP0016E":"Credential with same name already exists: ",
			"IDMXSSP0017E":"Issuing Organization with same name already exists: ",

			//broker messages
			"IDMXSBK0001E":"Provision could not be performed without request data.",
			"IDMXSBK0002E":"Provision was already done for instance with id: ",
			"IDMXSBK0003E":"Do not know what to do with id ",
			"IDMXSBK0004E":"De-provision was already done for instance with id: ",
			"IDMXSBK0005E":"Bind could not be performed without request data.",
			"IDMXSBK0006E":"Bind was already done for instance with id: ",
			"IDMXSBK0007E":"Do not know what to do with id  ",
			"IDMXSBK0008E":"This app was bind to different instance.",
			"IDMXSBK0009I":"Service instance is enabled and started",
			"IDMXSBK0010I":"Service instance is not enabled and stopped",
			"IDMXSBK0011E":"Unauthorized access!",
			"IDMXSBK0012E":"Instance is stopped and can't be accessed!",
			"IDMXSBK0013E":"Enablement could not be performed without request data.",
		}
};

module.exports = messages[lang];

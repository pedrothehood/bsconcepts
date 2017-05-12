jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"ypglmasterdetailportal/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"ypglmasterdetailportal/test/integration/pages/App",
	"ypglmasterdetailportal/test/integration/pages/Browser",
	"ypglmasterdetailportal/test/integration/pages/Master",
	"ypglmasterdetailportal/test/integration/pages/Detail",
	"ypglmasterdetailportal/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "ypglmasterdetailportal.view."
	});

	sap.ui.require([
		"ypglmasterdetailportal/test/integration/NavigationJourneyPhone",
		"ypglmasterdetailportal/test/integration/NotFoundJourneyPhone",
		"ypglmasterdetailportal/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});
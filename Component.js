	$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
	$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
	$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
	$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
	$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
jQuery.sap.require("ypglmasterdetailportal.util.Formatter");
sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"ypglmasterdetailportal/model/models",
		"ypglmasterdetailportal/controller/ListSelector",
		"ypglmasterdetailportal/controller/ErrorHandler"
	], function (UIComponent, Device, models, ListSelector, ErrorHandler) {
		"use strict";

		return UIComponent.extend("ypglmasterdetailportal.Component", {

			metadata : {
				"includes": ["css/css.css"],
				manifest : "json"
			},

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * In this method, the device models are set and the router is initialized.
			 * @public
			 * @override
			 */
			init : function () {
				var kalModel = this.getModel("kalender");
				this.oListSelector = new ListSelector();
				this._oErrorHandler = new ErrorHandler(this);

				// set the device model
				this.setModel(models.createDeviceModel(), "device");

				// call the base component's init function and create the App view
				UIComponent.prototype.init.apply(this, arguments);

				// create the views based on the url/hash
				this.getRouter().initialize();
				ypglmasterdetailportal.util.Formatter.component = this;
			},
            i19n: function(param, arr) {
            	// Leerzeichen aus param nehmen:
            if (param){
              param = param.replace(/\s/g, "");	
            } 
            var oBundle = this.getModel("i18n").getResourceBundle();
            return arr == undefined ?  oBundle.getText(param) : oBundle.getText(param, arr);
            },
			/**
			 * The component is destroyed by UI5 automatically.
			 * In this method, the ListSelector and ErrorHandler are destroyed.
			 * @public
			 * @override
			 */
			destroy : function () {
				this.oListSelector.destroy();
				this._oErrorHandler.destroy();
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			},
			sendMail: function(){
					 sap.m.URLHelper.triggerEmail("peter.gloor@mgb.ch", "Webseite", "Hallo Barbara");
			}

		});

	}
);
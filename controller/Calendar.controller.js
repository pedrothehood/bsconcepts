/*global location */
sap.ui.define([
	"ypglmasterdetailportal/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ypglmasterdetailportal/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("ypglmasterdetailportal.controller.Calendar", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("calendar").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");
			//	this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		goToItem: function(oEvent) {
			var router = this.getRouter();
			var customData = oEvent.getSource().getCustomData()[0];
			var bReplace = jQuery.device.is.phone ? false : true;
			var customValue = customData.getValue();
			router.navTo("object", {
				objectId: customValue
			}, bReplace);
			//console.log("hallo");
			//alert(itemKey);	
		},

		onCalenderKlick: function(oEvent) {

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			//				return;  /// Abkoppeln Detail
			// Path ermitteln:
			var oView = this.getView();
			// oElementBinding = oView.getElementBinding();
			var sPath = oEvent.getParameters().arguments.year;
			var oResourceBundle = this.getResourceBundle();

			// Objekt-Pfad aus Wert ermitteln:
			var tab = oView.getModel("kalender").oData.kalender;
			var retIndex;

			function findFirst(tab) {
				for (var i = 0; i < tab.length; i++) {
					if (sPath == tab[i].Jahr) {
						retIndex = i;
						return i;
					}
				}
			}
			findFirst(tab);

			/*			tab.find(   funktioniert nicht wegen find-Befehl im IE
							function(obj, index) {
								if (obj.LinkKey == sPath) retIndex = index;
							}
						);*/
			var path = '/kalender/' + retIndex + "/Monate";
			//var oObject = oView.getModel().getObject(path);

			var sObjectId = oEvent.getParameter("arguments").year;
			//	this.getModel().metadataLoaded().then( function() {
			/*	var sObjectPath = this.getModel().createKey("BSCONCEPTS", {  // Meine Analysen haben ergeben, dass Mandt=null ubergeben wird, ich konnte die Urs
        	 	                          // Ursache nicht herausfinden, der Unterschied zu anderen SEGW-Models ist, dass der Mandant in der Struktur ist!!!
						LinkKey :  sObjectId
					}); */
			//	var sObjectPath = "DEV_PORTALS(Mandt='994',LinkKey='SAP-UI5-SDK')";
			//	this._bindView("/" + sObjectId);
			var listPath = '/kalender/' + retIndex;
			//	this._bindView(path);
			this._bindView(listPath);
			// Model nur für Einzelanzeige erstellen:
			var data = this.getView().getModel("kalender").getData();
			var modelData = data.kalender[retIndex];

			for (var i = 0; i < modelData.Monate.length; i++) {
				modelData.Monate[i].Jahr = sObjectId; // Jahr muss auf "Monat" vererbt werden, wegen XML-Zugriff
				modelData.Monate[i].Text = modelData.Text;
			}

			var monatModel = new sap.ui.model.json.JSONModel();
			monatModel.setData(modelData);

			this.setModel(monatModel, "monatModel");

			var oList = this.byId("MonatsListe");
			//oList.bindItems("kalender>"+listPath);
			//oList.bindElement(listPath);
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

/*	Temporär Block ausschalten		// Immer erste Seite setzen:
			var carousel = this.getView().byId("calendarCarousel");
			var pages = carousel.getPages();
			carousel.setActivePage(pages[0]);
			// Text setzen:
			var carouselImageLabel = this.getView().byId("carouselImageLabel");
			if (carouselImageLabel) {
				carouselImageLabel.setText(carousel.getPages()[0].getAlt());
			}*/
			//	}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			// Liste explizit binden
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						//	oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath();
			var oResourceBundle = this.getResourceBundle();

			// Objekt-Pfad aus Wert ermitteln:
			var tab2 = oView.getModel("kalender").oData.kalender;
			var retIndex;

			function findFirst(tab) {
				for (var i = 0; i < tab.length; i++) {
					if (sPath.substr(1) === tab[i].Jahr) {
						retIndex = i;
						return i;
					}
				}
			}
			findFirst(tab2);

			/*	tab.find(
					function(obj, index) {
						if (obj.LinkKey == sPath.substr(1)) retIndex = index;
					}
				);*/
			//	var path = '/Links/' + retIndex;
			var path = oView.getElementBinding().getPath();
			var oObject = oView.getModel("kalender").getObject(sPath);

			//var	oObject = oView.getModel().getObject(sPath);
			//	var sObjectId = oObject.LinkKey;
			//	var sObjectName = oObject.Text;
			var oViewModel = this.getModel("detailView");

			/*			//	this.getOwnerComponent().oListSelector.selectAListItem(sPath);
						this.getOwnerComponent().oListSelector.selectAListItem(sPath);

						oViewModel.setProperty("/shareSendEmailSubject",
							oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
						oViewModel.setProperty("/shareSendEmailMessage",
							oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
				*/
		},

		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			//	oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		onPageChange: function(oEvent) {
			return;
			var carousel = this.getView().byId("calendarCarousel");
			var activeCarouselId = oEvent.getSource().getActivePage(); // gibt nur Id!!!
			var activeCarouselPage = null;
			//var pages = carousel.getPages();
			// Aktive Page als Objekt ermitteln:
			for (var i = 0; i < carousel.getPages().length; i++) {
				if (activeCarouselId === carousel.getPages()[i].getId()) {
					activeCarouselPage = carousel.getPages()[i];
				}
			}
			var carouselImageLabel = this.getView().byId("carouselImageLabel");

			if (carouselImageLabel && activeCarouselPage) {
				carouselImageLabel.setText(activeCarouselPage.getAlt());
				//alert("hallo");
			}
			/*			pageChanged: function(){
						alert("hallo");
					}*/
		},
			sendMail: function(){
			this.getOwnerComponent().sendMail();
		//	 sap.m.URLHelper.triggerEmail("peter.gloor@mgb.ch", "Webseite", "Hallo Barbara");
		}
	});

});
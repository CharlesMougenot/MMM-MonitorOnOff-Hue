/* global Module */

/* Magic Mirror
 * Module: MMM-MonitorOnOff-Hue
 * By Charles Mougenot
 * MIT Licensed
 */

Module.register("MMM-MonitorOnOff-Hue", {
  defaults: {
	bridgeip: "",
        userid: "",
	group: "",
	refreshTime: 1000,
  },
  getScripts: function () {
        return [this.file("js/jquery.js")];
  },
  start: function () {
	this.monitorActive = true;
	this.url = "http://" + this.config.bridgeip + "/api/" + this.config.userid + "/groups/" + this.config.group;
	this.getData();
	setInterval(() => {
            this.getData();
        }, this.config.refreshTime);

  },

  getDom: function() {
	if (this.result) {
		if (this.result.state.any_on && !this.monitorActive){
			this.sendNotification('REMOTE_ACTION', {action: 'MONITORON'});
			this.monitorActive = true;
		}
		if (!this.result.state.any_on && this.monitorActive){
			this.sendNotification('REMOTE_ACTION', {action: 'MONITOROFF'});
			this.monitorActive = false;
		}
	}
	return
  },

  notificationReceived: function() {},

  socketNotificationReceived: function() {},

  getData: function () {
	$.getJSON(this.url, (data) => {
	    this.result = data;
	    this.updateDom();
	});
  },
})


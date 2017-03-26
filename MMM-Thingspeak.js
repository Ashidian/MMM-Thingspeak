/* global Module */

/* Magic Mirror
 * Module: MMM-Thingspeak
 *
 * By Ashidian http://github.com/Ashidian
 * MIT Licensed.
 */

Module.register("MMM-Thingspeak",{

	// Default module config.
	defaults: {
		channels: [
			{
				id: 0,
				readKey: "XXXXXXXXXXXXXXX",
				writeKey: "XXXXXXXXXXXXXXX",
				fields: [1],
				updateInterval: 2 * 60 * 1000, // every 10 minutes
				updateTimeout: 15
			}
		],
		data : null
	},
	

	start: function () {
		Log.log("Starting module: " + this.name);

		//var self = this;
		//setInterval(function() {
		//	self.updateDom();
		//}, 1000);
		this.sendSocketNotification('START', this.config);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "THINGSPEAK_DATA") {
			this.defaults.data = payload;
			this.updateDom();
		}
	},

	// Override dom generator.
	getDom: function() {
		this.defaults.i = this.defaults.i + 1;
		var wrapper = document.createElement("div");
		wrapper.innerHTML = JSON.stringify(this.defaults.data);
		return wrapper;
	}
});

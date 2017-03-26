/* global require */

const NodeHelper = require('node_helper');
const ThingSpeakClient = require('thingspeakclient');

module.exports = NodeHelper.create({

    config: {},
    client : null,

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
	if (notification === 'START') {
		this.config = payload;

		updateTimeout = this.config.updateTimeout * 1000;
		this.client = new ThingSpeakClient({updateTimeout});
		query = null;
		for (i = 0; i < this.config.channels.length; i++) { 
			channel = this.config.channels[i];
			this.client.attachChannel(channel.id, { writeKey:channel.writeKey, readKey:channel.readKey}, this.callBackThingspeak);
		}
		
		var self = this;
                setInterval(function () {
			channel = this.config.channels[0];
			this.client.getFieldFeed(channel.id, channel.fields[0], query, function(err, resp) {
				self.sendSocketNotification("THINGSPEAK_DATA", resp);
			});
                }, self.config.updateInterval);


		//console.log("THINGSPEAK: " + callBack);
		//this.sendSocketNotification("THINGSPEAK_DATA", callBack);
	}
	//if (notification === "THINGSPEAK_GET_CHANNEL") {
	//    //this.createFetcher(payload.feed, payload.config);
	//    return;
	//}
    },

    callBackThingspeak : function(err, resp) {
    	if (!err && resp > 0) {
            console.log('Successfully. response was: ' + resp);
    	}
    	else {
      	    console.log(err);
    	}
    },

    /**
     *
     */
    off: function () {
    },

});

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
			var self = this;
			for (i = 0; i < this.config.channels.length; i++) { 
				channel = this.config.channels[i];
				this.client.attachChannel(channel.id, { writeKey:channel.writeKey, readKey:channel.readKey}, this.callBackThingspeak);

				setInterval(function () {
					client.getChannelFeeds(channel.id,  query, function(err, resp) {
						self.sendSocketNotification(channel.receiveKeyword, resp);
					});
				}, self.config.updateInterval);
			}
		}
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

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
				fields: [1, 2],
				query : null, // see https://de.mathworks.com/help/thingspeak/get-a-channel-feed.html valid parameters
				updateInterval: 10 * 60 * 1000, // every 10 minutes
				updateTimeout: 15,
				receiveKeyword: "HIGHCHARTS_REFRESH", // notification for sendNotification()
				convertToHighCharts: true
			}
		],
	},
	

	start: function () {
		Log.log("Starting module: " + this.name);

		this.sendSocketNotification('START', this.config);
	},

	socketNotificationReceived: function(notification, payload) {

		for (i = 0; i < channels.length; i++)
		{
			if (channel.receiveKeyword === notification)
			{
				if (this.config.convertToHighCharts)
				{
					payload = convertPayloadToHighCharts(payload);
				}

				this.sendNotification(notification, payload);
			
				break;
			}
		}
	},

	convertPayloadToHighCharts: function(payload)
	{
		options = {
			series : [],
			title: {
				text: payload.channel.name
			}
		};
		channel = channels[i];

		for (j = 0; j < channel.fields.length; j++) {
			f = channel.fields[j];
			options.series.push({
				name : payload.channel['field' + f.toString()],
				data : []
			});
		}
		for (var a = 0; a < payload.feeds.length; a++) {
			feed = payload.feeds[a];
			created = Date.parse(feed.created_at);
			for (j = 0; j < channel.fields.length) {
				f = channel.fields[j];
				if (feed['field' + f.toString()] != null)
				{
					options.series[j].data.push({
						x : created,
						y : parseInt(feed['field' + f.toString()])
					});
				}
			}
		}
		return options;
	},

	// Override dom generator.
	//getDom: function() {
	//	this.defaults.i = this.defaults.i + 1;
	//	var wrapper = document.createElement("div");
		//wrapper.innerHTML = JSON.stringify(this.defaults.data);
	//	return wrapper;
	//}
});
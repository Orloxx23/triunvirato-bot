const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity('/ayuda | Para servirte', { type: ActivityType.Watching });

		console.log(`\nReady! Logged in as ${client.user.tag}`.white.bold);
		console.log(`${client.user.presence.activities[0].name}`.white.bold);
	},
};
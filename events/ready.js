module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({ activities: [{ name: '/ayuda | Para servirte', type: 'Watching' }], status: 'online' });

		console.log(`\nReady! Logged in as ${client.user.tag}`.white.bold);
		console.log(`${client.user.presence.activities[0].name}`.white.bold);
	},
};
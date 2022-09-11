module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({
			activity: {
				name: '/ayuda | Para servirte',
				type: 'WATCHING',
			},
			status: 'online',
		});
		console.log(`\nReady! Logged in as ${client.user.tag}`.white.bold);
	},
};
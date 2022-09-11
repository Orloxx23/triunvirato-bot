module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	execute(oldState, newState) {
		if (newState.channel?.name === undefined) {
			const role = oldState.guild.roles.cache.find(r => r.name === '🔒');
			if (role) oldState.member.roles.remove(role).catch(console.error);

			const everyone = oldState.guild.roles.cache.find(todos00 => todos00.id === oldState.guild.id);

			const channel = oldState.channel;
			if (channel) {
				if (channel.members.size < 1) {
					channel.edit({
						permissionOverwrites: [{ id: everyone, allow: '0x0000000000100000' }],
					});
					if (role) {
						if (channel.permissionOverwrites.cache.find(r => r.id === role.id)) {
							if (role) role.delete();

						}
					}
				}
			}


		}
	},
};
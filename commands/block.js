const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bloquear')
		.setDescription('Bloquea o desbloquea tu canal de voz actual'),
	async execute(interaction) {
		if (interaction.member.voice.channel) {
			const everyone = interaction.guild.roles.cache.find(
				todos00 => todos00.id === interaction.guild.id,
			);

			const channel = interaction.member.voice.channel;

			if (channel.permissionOverwrites.cache.size < 2) {
				interaction.guild.roles.create({
					name: '🔒',
					mentionable: false,
					reason: 'Ocultar canal',
				}).then((res) => {
					const role = res;

					channel.edit({
						permissionOverwrites: [{ id: everyone.id, deny: '0x0000000000100000' }, { id: role.id, allow: '0x0000000000100000' }],
					}).then(channel.members.map(member => member.roles.add(role)));
				});

				return await interaction.reply({ content: `El canal de voz "${interaction.member.voice.channel.name}" ha sido bloqueado 🔒`, ephemeral: true });
			}
			else {
				channel.edit({
					permissionOverwrites: [{ id: everyone.id, allow: '0x0000000000100000' }],
				}).then(() => {
					const role = interaction.guild.roles.cache.find(r => r.name === '🔒');
					if (role) role.delete();

				});
				return await interaction.reply({ content: `El canal de voz "${interaction.member.voice.channel.name}" ha sido desbloqueado 🔓`, ephemeral: true });
			}
		}
		else {
			return await interaction.reply({ content: 'No estas en un canal de voz', ephemeral: true });
		}
	},
};

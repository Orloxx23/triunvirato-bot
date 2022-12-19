const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jugemos')
		.setDescription('Crea un invitación para tu canal de voz.'),
	async execute(interaction) {
		if (interaction.member.voice.channel) {
			try {
				const channel = interaction.member.voice.channel;
				channel.createInvite({ maxAge: 300, unique: true, reason: 'Invitación a jugar' }).then(invite => interaction.reply({ content: `Invitación creada: ${invite}` }));
			}
			catch (error) {
				console.error(error);
				interaction.reply({ content: 'No se pudo crear la invitación.', ephemeral: true });
			}
		}
		else {
			interaction.reply({ content: 'No estás en un canal de voz.', ephemeral: true });
		}
	},
};
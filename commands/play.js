const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproduce una canción')
		.addStringOption(option => option.setName('cancion').setDescription('Nombre de la canción').setRequired(true)),
	async execute(interaction) {
		if (interaction.member.voice.channel) {
			const cancion = interaction.options.getString('cancion');

			if (cancion === '') {
				return interaction.reply({ content: 'Debes ingresar una canción.', ephemeral: true });
			}

			interaction.reply({ content: `🔎 Buscando \`${cancion}\``, ephemeral: true });

			await interaction.client.distube.play(interaction.member.voice.channel, cancion, {
				member: interaction.member,
				textChannel: interaction.channel,
			});
		}
		else {
			return interaction.reply({ content: 'Debes estar en un canal de voz', ephemeral: true });
		}
	},
};

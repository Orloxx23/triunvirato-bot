const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Detener la reproducción de música.'),
	async execute(interaction) {
		const queue = interaction.client.distube.getQueue(interaction);
		if (!queue) return interaction.reply({ content: 'No hay ninguna canción en cola.', ephemeral: true });

		queue.stop();
		const stopEmbed = new EmbedBuilder()
			.setColor(0xFFFFFF)
			.setTitle('Lista de reproducción detenida')
			.setTimestamp()
			.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [stopEmbed] });
	},
};

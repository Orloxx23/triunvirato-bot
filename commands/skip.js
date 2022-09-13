const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Saltar a la siguiente canción.'),
	async execute(interaction) {
		const queue = interaction.client.distube.getQueue(interaction);
		if (!queue) return interaction.reply({ content: 'No hay ninguna canción en cola.', ephemeral: true });


		try {
			const song = await queue.skip();

			const skipEmbed = new EmbedBuilder()
				.setColor(0xFFFFFF)
				.setTitle('Saltando a la siguiente canción')
				.setDescription(song.name);

			return interaction.reply({ embeds: [skipEmbed] });
		}
		catch (e) {
			const errorEmbed = new EmbedBuilder()
				.setColor(0xFFFFFF)
				.setTitle(`Error: ${e}`)
				.setTimestamp()
				.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			return interaction.reply({ embeds: [errorEmbed] });
		}
	},
};

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('limpiar')
		.setDescription('Elimina hasta 99 mensajes.')
		.addIntegerOption(option => option.setName('cantidad').setDescription('Número de mensajes a eliminar (1-99)').setRequired(true)),
	async execute(interaction) {
		if (interaction.member.roles.cache.some(role => role.name === 'Owner')) {
			const amount = interaction.options.getInteger('cantidad');

			if (amount < 1 || amount > 99) {
				return interaction.reply({ content: 'Debe ingresar un número entre 1 y 99.', ephemeral: true });
			}
			await interaction.channel.bulkDelete(amount, true).catch(error => {
				console.error(error);
				interaction.reply({ content: '¡Hubo un error al intentar eliminar los mensajes en este canal!', ephemeral: true });
			});

			return interaction.reply({ content: `Se borraron \`${amount}\` mensajes.`, ephemeral: true });
		}
		else {
			return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
		}
	},
};
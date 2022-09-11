const { SlashCommandBuilder } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const commandsPath = path.join(__dirname, './');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ayuda')
		.setDescription('Obten una lista de comandos.'),

	async execute(interaction) {
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			const newCommand = {
				'name': '/' + command.data.name,
				'value': command.data.description,
			};
			commands.push(newCommand);
		}

		if (interaction.member.roles.cache.some(role => role.name === 'Owner')) {
			const help = {
				color: 0xFFFFFF,
				title: 'Comandos',
				fields: commands,
			};
			await interaction.reply({ embeds: [help] });
		}
	},
};

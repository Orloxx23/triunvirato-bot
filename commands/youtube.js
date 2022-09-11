const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { DiscordTogether } = require('discord-together');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Mira videos con tu amigos desde Discord.'),
	async execute(message) {
		client.discordTogether = new DiscordTogether(client);
		if (message.member.voice.channel) {
			client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
				return message.reply({ content: `${invite.code}` });
			});
		}
		else {
			return message.reply({ content: 'Debes estar en un canal de voz', ephemeral: true });
		}
	},
};

const { SlashCommandBuilder } = require('discord.js');

const red = require('reddit-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Obten un meme aleatorio.'),
	async execute(interaction) {
		red({
			subreddit: 'SpanishMeme',
			sort: 'hot',
			allowNSFW: false,
			allowModPost: false,
			allowCrossPost: false,
			allowVideo: true,
		}).then(async (post) => {
			if (!post.url) {
				return await interaction.reply('No encontre memes :(');
			}
			else {
				const meme = {
					color: 0xFFFFFF,
					title: post.title,
					image: {
						url: post.url,
					},
				};
				await interaction.reply({ embeds: [meme] });
			}
		});
		// await do something;
	},
};

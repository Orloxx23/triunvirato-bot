require('dotenv').config();
require('colors');

const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');

const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const token = process.env.TOKEN;

const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.MessageContent,
] });

client.distube = new DisTube(client, {
	leaveOnStop: false,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: false,
	plugins: [
		new SpotifyPlugin({
			emitEventsAfterFetching: true,
		}),
		new SoundCloudPlugin(),
		new YtDlpPlugin(),
	],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
	}
});

const status = queue =>
	`Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
		queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
	}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

client.distube
	.on('playSong', (queue, song) => {
		const playEmbed = new EmbedBuilder()
			.setColor(0xFFFFFF)
			.setTitle(song.name)
			.setTimestamp()
			.setFooter({ text: `Añadido por: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) });
		queue.textChannel.send({ embeds: [playEmbed] });
	},
	)
	.on('addSong', (queue, song) => {
		const addEmbed = new EmbedBuilder()
			.setColor(0xFFFFFF)
			.setTitle(`Añadida a la cola: ${song.name}`)
			.setTimestamp()
			.setFooter({ text: `Añadido por: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) });
		queue.textChannel.send({ embeds: [addEmbed] });
	},
	)
	.on('addList', (queue, playlist) =>
		queue.textChannel.send(
			`✅ | Added \`${playlist.name}\` playlist (${
				playlist.songs.length
			} songs) to queue\n${status(queue)}`,
		),
	)
	.on('error', (channel, e) => {
		if (channel) channel.reply(`❌ | An error encountered: ${e.toString().slice(0, 1974)}`);
		else console.error(e);
	})
	.on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
	.on('searchNoResult', (message, query) =>
		message.channel.send(`❌ | No result found for \`${query}\`!`),
	)
	.on('finish', queue => {
		const finishEmbed = new EmbedBuilder()
			.setColor(0xFFFFFF)
			.setTitle('No hay más canciones en la cola')
			.setTimestamp();
		queue.textChannel.send({ embeds: [finishEmbed] });
	});

client.login(token);
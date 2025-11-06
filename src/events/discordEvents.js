const chalk = require('chalk');

module.exports = {
    registerEvents(client, bot) {
        client.once('clientReady', () => {
            console.log(chalk.green(`Logged in as ${client.user.tag}`));
            console.log(chalk.green(`Bot is ready! Serving ${client.guilds.cache.size} server`));
        });

        client.on('messageCreate', (message) => {
            if (!message.content.startsWith(bot.prefix) || message.author.bot) return;

            const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = bot.commands.get(commandName);
            if (!command) return;

            try {
                command.execute(message, args, bot);
            } catch (error) {
                console.error(chalk.red(`Error executing command ${commandName}:`), error);
                message.reply('There was an error executing that command!');
            }
        });

        // Player events for error handling
        bot.player.events.on('error', (queue, error) => {
            console.error(chalk.red(`General player error: ${error.message}`));
            if (queue.metadata) {
                queue.metadata.reply('Something went wrong with Kunang-Kunang!');
            }
        });

        bot.player.events.on('playerError', (queue, error) => {
            console.error(chalk.red(`Player error: ${error.message}`));
            if (queue.metadata) {
                queue.metadata.reply('Error occurred while playing the track!');
            }
        });

        bot.player.events.on('trackStart', (queue, track) => {
            if (queue.metadata) {
                const embed = {
                    color: 0x2f3136,
                    author: {
                        name: 'Now Playing'
                    },
                    description: `[**${track.title}**](${track.url || 'https://example.com'})`,
                    fields: [
                        {
                            name: 'Channel',
                            value: track.author || 'Unknown',
                            inline: true
                        },
                        {
                            name: 'Duration',
                            value: track.duration || 'Unknown',
                            inline: true
                        },
                        {
                            name: 'Requested by',
                            value: track.requestedBy?.toString() || queue.metadata.author.toString(),
                            inline: true
                        }
                    ],
                    // Remove thumbnail from trackStart
                    // thumbnail: {
                    //     url: track.thumbnail || null
                    // },
                    timestamp: new Date(),
                    footer: {
                        text: `Volume: ${queue.node.volume}% • Queue: ${queue.tracks.size} songs`
                    }
                };
                queue.metadata.reply({ embeds: [embed] });
            }
        });

        bot.player.events.on('trackAdd', (queue, track) => {
            // Only show "Added to Queue" if there are already tracks playing/in queue
            // This prevents duplicate messages when using the play command
            if (queue.metadata && queue.tracks.size > 0) {
                const embed = {
                    color: 0x00ff00,
                    author: {
                        name: 'Added to queue'
                    },
                    description: `[**${track.title}**](${track.url || 'https://example.com'})`,
                    fields: [
                        {
                            name: 'Channel',
                            value: track.author || 'Unknown',
                            inline: true
                        },
                        {
                            name: 'Duration',
                            value: track.duration || 'Unknown',
                            inline: true
                        },
                        {
                            name: 'Position in queue',
                            value: `${queue.tracks.size}`,
                            inline: true
                        }
                    ],
                    // Remove thumbnail from trackAdd
                    // thumbnail: {
                    //     url: track.thumbnail || null
                    // },
                    timestamp: new Date(),
                    footer: {
                        text: `Requested by ${track.requestedBy?.username || 'Unknown'}`
                    }
                };
                queue.metadata.reply({ embeds: [embed] });
            }
        });

        bot.player.events.on('botDisconnect', (queue) => {
            if (queue.metadata) {
                const embed = {
                    color: 0xff0000,
                    title: 'Disconnected',
                    description: 'I was disconnected from the voice channel, clearing queue!',
                    timestamp: new Date(),
                    footer: {
                        text: 'Kunang-Kunang'
                    }
                };
                queue.metadata.reply({ embeds: [embed] });
            }
        });

        bot.player.events.on('channelEmpty', (queue) => {
            console.log(chalk.yellow('Voice channel is empty, starting idle timer'));
        });

        bot.player.events.on('queueEnd', (queue) => {
            if (queue.metadata) {
                const embed = {
                    color: 0xffff00,
                    title: 'Queue Finished',
                    description: 'Queue finished! No more songs to play.',
                    timestamp: new Date(),
                    footer: {
                        text: 'Kunang-Kunang'
                    }
                };
                queue.metadata.reply({ embeds: [embed] });
            }
        });

        // Audio player error handling
        bot.player.events.on('audioTrackAdd', (queue, track) => {
            console.log(chalk.blue(`Track added: ${track.title}`));
        });

        bot.player.events.on('disconnect', (queue) => {
            console.log(chalk.yellow('Bot disconnected from voice channel'));
        });

        bot.player.events.on('emptyChannel', (queue) => {
            console.log(chalk.yellow('Voice channel is empty'));
        });

        bot.player.events.on('emptyQueue', (queue) => {
            console.log(chalk.yellow('Queue is empty'));
        });
    }
};
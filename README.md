# Kunang-Kunang - Discord Music Bot with TikTok Live Integration

A powerful Discord music bot built with discord.js v14 and discord-player v7.1.x, featuring unique TikTok live chat integration that allows viewers to control music through TikTok live streams.

## Features

### Music Player
- **High-quality audio playback** with multiple sources support
- **SoundCloud integration** with custom extractor
- **Queue management** with professional UI
- **Music controls** (play, pause, resume, skip, stop)
- **Volume control** and loop functionality
- **Now playing** with progress bar
- **Auto-leave** when voice channel is empty or idle

### TikTok Live Integration
- **Real-time bridge** between TikTok live chat and Discord
- **Cross-platform commands** - control Discord bot from TikTok comments
- **Automatic reconnection** with failure handling
- **Statistics tracking** and monitoring
- **Manual bridge control** via Discord commands

### User Interface
- **Jockie Music inspired design** with clean, professional embeds
- **Dark theme** with consistent color scheme (0x2f3136)
- **Message editing** for smooth UX (no spam)
- **Thumbnail support** (only for play command)
- **Clean typography** without excessive emojis

### Configuration
- **Centralized config** in `src/config.js`
- **Environment variables** for sensitive data
- **Customizable settings** for all features
- **Easy deployment** with minimal setup

## Quick Start

### Prerequisites
- Node.js 16.x or higher
- Discord Bot Token
- **SoundCloud API credentials (Required)**
- TikTok username for live integration (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kunang-kunang.git
cd kunang-kunang
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env` file in root directory:
```env
# Discord Configuration (Required)
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_VOICE_CHANNEL_ID=your_voice_channel_id_here

# SoundCloud API credentials (Required)
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
SOUNDCLOUD_OAUTH_TOKEN=your_soundcloud_oauth_token

# TikTok Integration (Optional)
TIKTOK_USERNAME=tiktok_username_for_live_chat
```

### Getting SoundCloud API Credentials

**Important**: SoundCloud API credentials are required for the bot to function properly.

1. **Visit SoundCloud Developers**
   - Go to [SoundCloud Developers](https://developers.soundcloud.com/)
   - Sign in with your SoundCloud account

2. **Create an Application**
   - Click "Register a new application"
   - Fill in your app details:
     - App name: Your bot name
     - Website URL: Your website or GitHub repo
     - Description: Discord music bot

3. **Get Your Credentials**
   - After creating the app, you'll get:
     - `Client ID`: Your application's client ID
     - `Client Secret`: Keep this secure (not needed for basic usage)

4. **Get OAuth Token (if needed)**
   - For enhanced features, you may need an OAuth token
   - Follow SoundCloud's OAuth documentation

5. **Add to .env file**
   ```env
   SOUNDCLOUD_CLIENT_ID=your_client_id_here
   SOUNDCLOUD_OAUTH_TOKEN=your_oauth_token_here
   ```

4. **Bot Configuration**
Edit `src/config.js` to customize settings:
```javascript
module.exports = {
    bot: {
        prefix: '!',
        activity: {
            name: 'music',
            type: 2 // LISTENING
        }
    },
    player: {
        defaultVolume: 100,
        defaultSearchEngine: 'soundcloud',
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000, // 5 minutes
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000
    }
}
```

5. **Start the bot**
```bash
npm start
# or
node src/index.js
```

## Commands

### Music Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `!play <song>` | - | Play a song or add to queue |
| `!skip` | - | Skip current track |
| `!pause` | - | Pause current track |
| `!resume` | - | Resume paused track |
| `!stop` | - | Stop music and clear queue |
| `!queue` | `!q` | Show current queue |
| `!nowplaying` | `!np`, `!current` | Show currently playing track |
| `!volume <1-100>` | `!vol` | Set playback volume |

### TikTok Bridge Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `!tiktok` | `!tt`, `!bridge` | Show TikTok bridge status |
| `!tiktok stats` | - | Show detailed statistics |
| `!tiktok disconnect` | - | Disconnect TikTok bridge |
| `!tiktok reconnect` | - | Reconnect TikTok bridge |

### Configuration Commands
| Command | Aliases | Description |
|---------|---------|-------------|
| `!config` | `!cfg` | Show bot configuration |

## Configuration

### Bot Settings (`src/config.js`)

```javascript
module.exports = {
    // Bot behavior
    bot: {
        prefix: '!',                    // Command prefix
        activity: {
            name: 'music',              // Bot activity text
            type: 2                     // Activity type (LISTENING)
        }
    },
    
    // Music player settings
    player: {
        defaultVolume: 100,             // Default volume (1-100)
        defaultSearchEngine: 'soundcloud', // youtube, soundcloud, spotify
        maxQueueSize: 100,              // Maximum songs in queue
        leaveOnEmpty: true,             // Leave when voice channel empty
        leaveOnEmptyCooldown: 300000,   // Wait time before leaving (ms)
        leaveOnEnd: true,               // Leave when queue ends
        leaveOnEndCooldown: 300000      // Wait time after queue ends (ms)
    }
}
```

### Environment Variables (`.env`)

```env
# Discord Configuration (Required)
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_VOICE_CHANNEL_ID=your_voice_channel_id_here

# SoundCloud API credentials (Required)
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
SOUNDCLOUD_OAUTH_TOKEN=your_soundcloud_oauth_token

# TikTok Integration (Optional)
TIKTOK_USERNAME=tiktok_username_for_live_chat
```

## Project Structure

```
src/
├── commands/           # Discord bot commands
│   ├── play.js        # Music playback
│   ├── queue.js       # Queue management
│   ├── nowplaying.js  # Now playing display
│   ├── skip.js        # Skip track
│   ├── pause.js       # Pause/resume
│   ├── stop.js        # Stop music
│   ├── volume.js      # Volume control
│   ├── tiktok-stats.js # TikTok bridge monitoring
│   └── config-info.js # Configuration display
├── events/            # Event handlers
│   └── discordEvents.js # Discord and player events
├── extractors/        # Custom music extractors
│   └── SoundCloudExtractor.js # SoundCloud support
├── utils/             # Utility modules
│   └── TikTokBridge.js # TikTok live integration
├── config.js          # Bot configuration
└── index.js          # Main application entry
```

## TikTok Live Integration

### How it Works

1. **Connect to TikTok Live**: Bot connects to specified TikTok user's live stream
2. **Monitor Chat**: Listens for commands in TikTok live chat
3. **Execute Commands**: Processes commands and controls Discord music bot
4. **Cross-platform Control**: TikTok viewers can control Discord music

### Supported Commands from TikTok

Any Discord music command can be used in TikTok live chat but cant displayed in TikTok live chat

### TikTok Bridge Features

- **Auto-reconnection** with failure handling
- **Statistics tracking** (commands processed, uptime)
- **Manual control** via Discord commands
- **Real-time monitoring** and status display
- **Error handling** and logging


## Development

### Adding New Commands

1. Create command file in `src/commands/`
2. Follow existing command structure:

```javascript
module.exports = {
    name: 'commandname',
    aliases: ['alias1', 'alias2'],
    description: 'Command description',
    execute: async (message, args, bot) => {
        // Command logic here
    }
};
```

### Custom Music Sources

1. Create extractor in `src/extractors/`
2. Register in `src/index.js`:

```javascript
await this.player.extractors.register(YourExtractor, {});
```

### Event Handling

Add event handlers in `src/events/discordEvents.js`:

```javascript
bot.player.events.on('eventName', (queue, data) => {
    // Handle event
});
```

## TODO

### Planned Features

- [ ] **Add Spotify source integration**
  - Implement Spotify API for music search and playback
  - Support for Spotify playlists and albums
  - Direct Spotify URL support

- [ ] **Add Apple Music source integration**
  - Implement Apple Music API integration
  - Support for Apple Music playlists
  - Cross-platform music discovery

- [ ] **Add YouTube Music source integration**
  - Enhanced YouTube Music search capabilities
  - Better audio quality for YouTube Music tracks
  - Playlist and mix support

- [ ] **Make TikTok chat assistant**
  - Display command responses in TikTok live chat
  - Real-time feedback for TikTok viewers
  - Enhanced cross-platform interaction
  - Visual indicators for successful commands

### Future Enhancements

- [ ] **Web dashboard** for bot management
- [ ] **Multi-server support** with separate configurations
- [ ] **User preferences** and personalized playlists
- [ ] **Advanced queue management** (shuffle, repeat modes)
- [ ] **Voice commands** integration
- [ ] **Lyrics display** for current tracks
- [ ] **Music recommendations** based on listening history

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Acknowledgments

- [discord.js](https://discord.js.org/) - Discord API library
- [discord-player](https://discord-player.js.org/) - Music player framework
- [tiktok-live-connector](https://www.npmjs.com/package/tiktok-live-connector) - TikTok live integration

## Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation

---

**Kunang-Kunang music bot - adios**
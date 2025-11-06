module.exports = {
    // Bot settings
    bot: {
        prefix: '!',
        activity: {
            name: 'Kunang-Kunang Music',
            type: 2 // 0: PLAYING, 1: STREAMING, 2: LISTENING, 3: WATCHING, 5: COMPETING
        }
    },
    
    // Music player settings
    player: {
        defaultVolume: 100,
        defaultSearchEngine: 'soundcloud', // youtube, soundcloud, spotify
        maxQueueSize: 100,
        
        // Auto-leave settings (manual configuration)
        leaveOnEmpty: false, // Leave when voice channel is empty
        leaveOnEmptyCooldown: 5 * 60 * 1000, // 5 minutes in milliseconds
        leaveOnEnd: false, // Leave when queue ends
        leaveOnEndCooldown: 5 * 60 * 1000, // 5 minutes in milliseconds
        
        // Additional player options
        selfDeaf: true, // Bot will deafen itself when joining voice channels
        volume: 100, // Default volume (0-100)
        quality: 'high' // low, medium, high
    }
};
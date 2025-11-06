module.exports = {
    // Utility functions for the bot
    
    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },

    createProgressBar(current, total, length = 20) {
        const progress = Math.round((current / total) * length);
        const empty = length - progress;
        
        const progressText = '='.repeat(progress);
        const emptyText = '-'.repeat(empty);
        
        return `[${progressText}${emptyText}]`;
    },

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
};
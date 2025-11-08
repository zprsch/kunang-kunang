/**
 * Kunang-Kunang Music Overlay
 * Polling-based overlay for OBS browser source
 */

class MusicOverlay {
    constructor() {
        this.pollingInterval = 5000; // dont change default here, change in config.js
        this.pollingId = null;
        this.lastData = null;
        this.isConnected = false;

        this.init();
    }

    init() {
        console.log('Initializing Kunang-Kunang Music Overlay...');
        this.bindElements();
        this.startPolling();
    }

    bindElements() {
        this.elements = {
            overlay: document.getElementById('overlay'),
            statusIndicator: document.getElementById('status-indicator'),
            currentTrack: document.getElementById('current-track'),
            trackTitle: document.getElementById('track-title'),
            trackAuthor: document.getElementById('track-author'),
            thumbnailImg: document.getElementById('thumbnail-img'),
            queueList: document.getElementById('queue-list'),
            lastUpdate: document.getElementById('last-update'),
            connectionStatus: document.getElementById('connection-status')
        };
    }

    startPolling() {
        this.fetchData();

        this.pollingId = setInterval(() => {
            this.fetchData();
        }, this.pollingInterval);

        console.log(`Started polling every ${this.pollingInterval}ms`);
    }

    stopPolling() {
        if (this.pollingId) {
            clearInterval(this.pollingId);
            this.pollingId = null;
            console.log('Stopped polling');
        }
    }

    async fetchData() {
        try {
            const response = await fetch('/api/nowplaying');
            const data = await response.json();

            if (data.pollingInterval && data.pollingInterval !== this.pollingInterval) {
                console.log(`Updating polling interval to ${data.pollingInterval}ms`);
                this.pollingInterval = data.pollingInterval;
                this.restartPolling();
            }

            this.updateOverlay(data);
            this.updateConnectionStatus(true);

        } catch (error) {
            console.error('Failed to fetch overlay data:', error);
            this.updateConnectionStatus(false);
        }
    }

    updateOverlay(data) {
        this.lastData = data;

        this.updateNowPlaying(data.current, data.isPlaying);

        this.updateQueue(data.queue);

        this.updateLastUpdate(data.lastUpdate);
    }

    updateNowPlaying(track, isPlaying) {
        const statusIndicator = this.elements.statusIndicator;

        if (track) {
            this.elements.trackTitle.textContent = track.title || 'Unknown Track';
            this.elements.trackAuthor.textContent = `by ${track.author || 'Unknown Artist'}`;

            if (track.thumbnail) {
                this.elements.thumbnailImg.src = track.thumbnail;
                this.elements.thumbnailImg.style.display = 'block';
            } else {
                this.elements.thumbnailImg.style.display = 'none';
            }

            statusIndicator.className = 'status-indicator';
            if (isPlaying) {
                statusIndicator.classList.add('playing');
            } else {
                statusIndicator.classList.add('paused');
            }

        } else {
            this.elements.trackTitle.textContent = 'No song playing';
            this.elements.trackAuthor.textContent = 'Add songs to the queue';
            this.elements.thumbnailImg.style.display = 'none';
            statusIndicator.className = 'status-indicator';
        }
    }

    updateQueue(queue) {
        const queueList = this.elements.queueList;

        if (!queue || queue.length === 0) {
            queueList.innerHTML = '<div class="queue-item empty">No songs in queue</div>';
            return;
        }

        const queueItems = queue.map((song, index) => `
            <div class="queue-item">
                <div class="title">${song.title || 'Unknown Track'}</div>
                <div class="author">by ${song.author || 'Unknown Artist'}</div>
            </div>
        `).join('');

        queueList.innerHTML = queueItems;
    }

    updateLastUpdate(timestamp) {
        if (timestamp) {
            const date = new Date(timestamp);
            const timeString = date.toLocaleTimeString();
            this.elements.lastUpdate.textContent = `Last update: ${timeString}`;
        }
    }

    updateConnectionStatus(connected) {
        this.isConnected = connected;
        const statusElement = this.elements.connectionStatus;

        if (connected) {
            statusElement.textContent = 'Connected';
            statusElement.style.color = '#4CAF50';
        } else {
            statusElement.textContent = 'Disconnected';
            statusElement.style.color = '#f44336';
        }
    }

    restartPolling() {
        this.stopPolling();
        this.startPolling();
    }

    setPollingInterval(interval) {
        if (interval >= 1000 && interval <= 60000) { // 1 second to 1 minute
            this.pollingInterval = interval;
            this.restartPolling();
            console.log(`Polling interval set to ${interval}ms`);
        } else {
            console.warn('Polling interval must be between 1000-60000ms');
        }
    }

    getStatus() {
        return {
            isConnected: this.isConnected,
            lastData: this.lastData,
            pollingInterval: this.pollingInterval
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicOverlay = new MusicOverlay();
});

window.setPollingInterval = (interval) => {
    if (window.musicOverlay) {
        window.musicOverlay.setPollingInterval(interval);
    }
};

window.getOverlayStatus = () => {
    if (window.musicOverlay) {
        return window.musicOverlay.getStatus();
    }
};
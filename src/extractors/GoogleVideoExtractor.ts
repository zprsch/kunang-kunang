import { BaseExtractor, ExtractorSearchContext, ExtractorInfo } from 'discord-player';
import { YoutubeSabrExtractor } from 'discord-player-googlevideo';
import { Logger } from '../utils/logging.js';

class GoogleVideoExtractor extends BaseExtractor {
    static identifier = 'google-video';
    private sabrExtractor: any = null;

    async activate(): Promise<void> {
        Logger.debug('GoogleVideoExtractor: Activating extractor...');

        try {
            // Initialize the SABR extractor
            this.sabrExtractor = new YoutubeSabrExtractor(this.context, {});
            await this.sabrExtractor.activate();
            Logger.debug('GoogleVideoExtractor: SABR extractor initialized successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error(`GoogleVideoExtractor activation error: ${errorMessage}`);
            Logger.debug(`GoogleVideoExtractor: SABR extractor failed to initialize - ${errorMessage}`);
            throw error;
        }
    }

    async deactivate(): Promise<void> {
        Logger.debug('GoogleVideoExtractor: Deactivating extractor...');

        try {
            if (this.sabrExtractor && this.sabrExtractor.deactivate) {
                await this.sabrExtractor.deactivate();
            }
            Logger.debug('GoogleVideoExtractor: SABR extractor deactivated');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error(`GoogleVideoExtractor deactivation error: ${errorMessage}`);
        }
    }

    async validate(query: string): Promise<boolean> {
        if (typeof query !== 'string' || query.length === 0) {
            Logger.debug(`GoogleVideoExtractor: Validating query "${query?.substring(0, 50)}${query?.length > 50 ? '...' : ''}" - invalid query (not a string or empty)`);
            return false;
        }

        // Check if it's a YouTube URL that SABR extractor can handle
        const isYouTubeUrl = this.isYouTubeURL(query);
        if (isYouTubeUrl) {
            Logger.debug(`GoogleVideoExtractor: Validating query "${query?.substring(0, 50)}${query?.length > 50 ? '...' : ''}" - valid YouTube URL`);
            return true;
        }

        // Accept general search queries (SABR extractor can handle search)
        const isUrl = /^https?:\/\//.test(query);
        if (isUrl) {
            // Reject non-YouTube URLs
            Logger.debug(`GoogleVideoExtractor: Validating query "${query?.substring(0, 50)}${query?.length > 50 ? '...' : ''}" - rejecting non-YouTube URL`);
            return false;
        }

        // Accept search queries
        Logger.debug(`GoogleVideoExtractor: Validating query "${query?.substring(0, 50)}${query?.length > 50 ? '...' : ''}" - valid search query`);
        return true;
    }

    async handle(query: string, context: ExtractorSearchContext): Promise<ExtractorInfo> {
        Logger.debug(`GoogleVideoExtractor: Handling query: "${query?.substring(0, 50)}${query?.length > 50 ? '...' : ''}"`);

        if (!this.sabrExtractor) {
            Logger.debug('GoogleVideoExtractor: SABR extractor not initialized');
            return { playlist: null, tracks: [] };
        }

        try {
            // Use the SABR extractor to handle the query
            const result = await this.sabrExtractor.handle(query, context);

            if (result && result.tracks && result.tracks.length > 0) {
                Logger.debug(`GoogleVideoExtractor: SABR extractor returned ${result.tracks.length} tracks`);

                // Convert tracks to our format if needed
                const convertedTracks = result.tracks.map((track: any) => this.convertToTrackData(track));
                Logger.debug(`GoogleVideoExtractor: Converted ${convertedTracks.length} tracks`);

                return {
                    playlist: result.playlist || null,
                    tracks: convertedTracks
                } as unknown as ExtractorInfo;
            } else {
                Logger.debug('GoogleVideoExtractor: SABR extractor returned no tracks');
                return { playlist: null, tracks: [] };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error(`GoogleVideoExtractor error: ${errorMessage}`);
            Logger.debug(`GoogleVideoExtractor: Handle method failed - ${errorMessage}`);
            return { playlist: null, tracks: [] };
        }
    }

    async stream(info: any): Promise<string> {
        Logger.debug(`GoogleVideoExtractor: Streaming track: "${info.title}"`);

        if (!this.sabrExtractor) {
            Logger.debug('GoogleVideoExtractor: SABR extractor not initialized');
            throw new Error('SABR extractor not initialized');
        }

        try {
            // Use SABR extractor for streaming
            const streamUrl = await this.sabrExtractor.stream(info);
            Logger.debug('GoogleVideoExtractor: SABR extractor provided stream URL');
            return streamUrl;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error(`GoogleVideoExtractor stream error: ${errorMessage}`);
            Logger.debug(`GoogleVideoExtractor: Stream method failed - ${errorMessage}`);
            throw error;
        }
    }

    async getRelatedTracks(track: any, history?: any): Promise<ExtractorInfo> {
        Logger.debug(`GoogleVideoExtractor: Getting related tracks for: "${track.title}"`);

        if (!this.sabrExtractor || !this.sabrExtractor.getRelatedTracks) {
            Logger.debug('GoogleVideoExtractor: Related tracks method not available');
            return { playlist: null, tracks: [] };
        }

        try {
            const relatedTracks = await this.sabrExtractor.getRelatedTracks(track);
            Logger.debug(`GoogleVideoExtractor: Found ${relatedTracks.length} related tracks`);

            // Convert to ExtractorInfo format
            const convertedTracks = relatedTracks.map((t: any) => this.convertToTrackData(t));

            return {
                playlist: null,
                tracks: convertedTracks
            } as unknown as ExtractorInfo;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error(`GoogleVideoExtractor related tracks error: ${errorMessage}`);
            return { playlist: null, tracks: [] };
        }
    }

    convertToTrackData(trackData: any): any {
        // Convert SABR track format to our standard format
        return {
            title: trackData.title || 'Unknown Title',
            description: trackData.description || '',
            author: trackData.author || trackData.channel?.name || 'Unknown Artist',
            url: trackData.url || '',
            thumbnail: trackData.thumbnail || trackData.thumbnails?.[0]?.url || null,
            duration: this.formatDuration(trackData.duration || trackData.durationMS),
            views: trackData.views || 0,
            source: 'youtube-sabr',
            engine: trackData,
            live: trackData.live || false,
            raw: trackData,
            metadata: {
                videoId: trackData.id || trackData.videoId,
                channel: trackData.author || trackData.channel?.name,
                uploadDate: trackData.uploadedAt || trackData.publishedAt,
                genre: trackData.genre,
                quality: 'SABR (High Quality)'
            }
        };
    }

    isYouTubeURL(url: string): boolean {
        const youtubeUrlRegex = /^https?:\/\/(www\.|m\.|music\.)?youtube\.com\/(watch\?v=[^&\n?#]+|embed\/[^&\n?#]+|v\/[^&\n?#]+|shorts\/[^&\n?#]+)|https?:\/\/youtu\.be\/[^&\n?#]+/;
        return youtubeUrlRegex.test(url);
    }

    formatDuration(duration: any): string {
        if (!duration) return '0:00';

        if (typeof duration === 'number') {
            // Assume milliseconds
            const seconds = Math.floor(duration / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        if (typeof duration === 'string') {
            if (duration.includes(':')) {
                return duration;
            }
            const seconds = parseInt(duration);
            if (!isNaN(seconds)) {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        }

        if (duration.seconds) {
            const mins = Math.floor(duration.seconds / 60);
            const secs = duration.seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        return '0:00';
    }
}

export { GoogleVideoExtractor };
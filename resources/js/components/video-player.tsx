import React, { PropsWithChildren } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

// This imports the functional component from the previous sample.
import useVideoPlayerStore from '@/stores/video-player-store';
import { usePage } from '@inertiajs/react';
import VideoJS, { sourceType } from './ui/video-js';

const VideoPlayer = (props: PropsWithChildren<sourceType>) => {
    const playerRef = React.useRef<Player>(null);
    const { updatePlaylist } = props;
    const page = usePage();
    const { setWaiting } = useVideoPlayerStore((state) => state);

    const handlePlayerReady = (player: Player) => {
        playerRef.current = player;

        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const handleUpdatePlaylist = (currentIndex: number, player: Player) => {
        // player.ima.setContentWithAdTag(null, page.props.adssUrl, true);

        // player.ima.requestAds();

        updatePlaylist(currentIndex);
    };

    return <VideoJS sources={props.sources} onReady={handlePlayerReady} updatePlaylist={handleUpdatePlaylist} />;
};

export default VideoPlayer;

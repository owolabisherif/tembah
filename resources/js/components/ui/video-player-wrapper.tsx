import useVideoPlayerStore from "@/stores/video-player-store";
import { VideoNewsType, VideoSourceType } from "@/types/news";
import { usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "../video-player";

type VideoPlayerProp = {
    sources: VideoSourceType[]
}

export default function VideoPlayerWrapper({sources}: VideoPlayerProp) {
    const [selected, setSelected] = useState(0);
    const [reset, setReset] = useState(0);
    const [videoSource, setVideoSource] = useState<VideoSourceType[]>([]);
    const { index, player, jump, init, setWaiting, waiting } = useVideoPlayerStore((state) => state);
    const page = usePage();
    const playerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if(!player) return

        player.on('ended', () => {
            let val = reset + 1
            setReset(val)
        })
    }, [player])

    var total: number = 0;
    var actutalTotal: number = 0;
    var timeout: ReturnType<typeof setTimeout> | undefined | null;
    
    const handleSetTimeout = () => {
        if (selected === sources.length - 1) {
            setSelected(0);
        } else {
            setSelected((n) => n + 1);
        }

        setTimeout(handleSetTimeout, 600);
    };

    useEffect(() => {
        total = actutalTotal = sources.length - 1;
        setSelected(0);
        handleSetVideoSource();
    }, []);

    window.addEventListener('close', () => {
        clearTimeout(timeout!);
        timeout = null;
    });

    const handleSelected = (index: number) => {
        if (waiting || !player) return;

        setSelected(index);
        jump(index);

        (player as any).ima.changeAdTag(page.props.adsUrl);
        (player as any).ima.requestAds();
    };

    const handleSetVideoSource = () => {
        var sourceList: VideoSourceType[] = [];

        for (const item of sources) {
            let ars = item.src.split('.');
            var type = ars[ars.length - 1];
            sourceList.push({ src: item.src, type: `video/${type}` });
        }

        setVideoSource(sourceList);
        init(sourceList.length); 
    };

    const handleUpdatePlaylist = (currentIndex: number) => {};

    return  <VideoPlayer sources={videoSource} key={reset} updatePlaylist={handleUpdatePlaylist}/>
}
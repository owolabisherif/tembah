import Player from "video.js/dist/types/player"
import {create} from "zustand"

interface VideoPlayerStore {
    index: number,
    playlistLength: number,
    waiting: boolean,
    player: Player | null,
    setPlayer: (player: Player) => void,
    init: (length: number) => void
    inc: () => void
    jump: (to: number) => void
    setWaiting: (to: boolean) => void
    reset: () => void
}


const useVideoPlayerStore = create<VideoPlayerStore>()((set) => ({
    index: 0,
    playlistLength: 0,
    waiting: false,
    player: null,
    init: (length) => set(() => ({playlistLength: length})),
    inc: () => set((state) => ({index: state.index + 1})),
    setWaiting: (to) => set(() => ({waiting: to})),
    jump: (to) => set(() => ({index: to})),
    reset: () => set(() => ({index: 0})),
    setPlayer: (player) => set((state) => ({player: player}))
}))



export default useVideoPlayerStore
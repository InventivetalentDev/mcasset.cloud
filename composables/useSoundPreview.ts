import { reactive, readonly } from 'vue';

export type SoundPreviewStatus = 'idle' | 'loading' | 'playing' | 'error';

interface SoundPreviewState {
    /** URL of the sound that is currently loading/playing, or null when nothing is */
    src: string | null;
    status: SoundPreviewStatus;
    /** Playback progress in percent (0-100) */
    progress: number;
}

// One shared <audio> element for the whole app: only one preview plays at a time, and playback
// keeps going even if the list item that started it is recycled by a virtual scroller.
const state = reactive<SoundPreviewState>({
    src: null,
    status: 'idle',
    progress: 0
});
let audio: HTMLAudioElement | null = null;

const reset = () => {
    state.src = null;
    state.status = 'idle';
    state.progress = 0;
};

const getAudio = (): HTMLAudioElement => {
    if (audio) return audio;
    audio = new Audio();
    audio.preload = 'auto';
    audio.addEventListener('playing', () => {
        state.status = 'playing';
    });
    audio.addEventListener('waiting', () => {
        if (state.status === 'playing') state.status = 'loading';
    });
    audio.addEventListener('timeupdate', () => {
        if (!audio) return;
        state.progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    });
    audio.addEventListener('ended', reset);
    audio.addEventListener('error', () => {
        if (state.status !== 'idle') state.status = 'error';
    });
    return audio;
};

const play = (src: string) => {
    if (typeof window === 'undefined') return;
    const el = getAudio();
    el.pause();
    state.src = src;
    state.status = 'loading';
    state.progress = 0;
    el.src = src;
    el.currentTime = 0;
    el.play().catch((e: unknown) => {
        // AbortError just means another preview was started before this one could begin
        if (state.src !== src) return;
        if (e instanceof DOMException && e.name === 'AbortError') return;
        state.status = 'error';
    });
};

const stop = () => {
    audio?.pause();
    reset();
};

/** Start the given sound, or stop it if it is the one currently playing */
const toggle = (src: string) => {
    if (state.src === src && state.status !== 'error') {
        stop();
    } else {
        play(src);
    }
};

export function useSoundPreview() {
    return {
        state: readonly(state),
        play,
        stop,
        toggle
    };
}

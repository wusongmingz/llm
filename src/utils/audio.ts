export const AUDIO_DIR = {
  SONG: '/resource/bell玲惠 - 可能 (Live).ogg',
  WARNING: '0',
};

export function playAudio(url: string) {
  const audio = document.createElement('audio');
  audio.src = url;
  audio.play(); // 播放音频
}

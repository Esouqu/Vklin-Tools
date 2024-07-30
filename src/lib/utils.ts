export function loadAudio(audioFile: string) {
  const audio = new Audio(audioFile);

  audio.load();

  return new Audio(audioFile);
}

export function playSound(sound: HTMLAudioElement | undefined, volume: number = 0.1) {
  if (!sound) return;

  sound.volume = volume;
  sound.load();
  sound.play();
}

export function randomWithinRange(max: number): number {
  return Math.round(Math.random() * max * 2 - max);
}

export function randomFromArray<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function arrayFromRange(min: number, max: number): number[] {
  const result = [];

  for (let i = min; i <= max; i++) {
    result.push(i);
  }

  return result;
}

export function getNoun(num: number, words: string[]) {
  const lastTwoDigits = Math.abs(num) % 100;
  const lastDigit = lastTwoDigits % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return words[2];
  } else if (lastDigit === 1) {
    return words[0];
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return words[1];
  } else {
    return words[2];
  }
}
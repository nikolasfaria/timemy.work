import { useCallback } from 'react';

export const useSuccessSound = () => {
    const playSuccessSound = useCallback(() => {
        // Criar um som sintético de sucesso usando Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Frequências para criar um som agradável de sucesso
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (acorde de Dó maior)

        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';

            // Envelope ADSR para som mais natural
            const startTime = audioContext.currentTime + (index * 0.1);
            const attackTime = 0.1;
            const decayTime = 0.1;
            const sustainLevel = 0.3;
            const releaseTime = 0.5;

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2, startTime + attackTime);
            gainNode.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
            gainNode.gain.linearRampToValueAtTime(0, startTime + attackTime + decayTime + releaseTime);

            oscillator.start(startTime);
            oscillator.stop(startTime + attackTime + decayTime + releaseTime);
        });
    }, []);

    return { playSuccessSound };
};

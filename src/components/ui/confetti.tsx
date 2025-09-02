import { useCallback, useEffect, useImperativeHandle, forwardRef } from "react";
import confetti, { type Options as ConfettiOptions } from "canvas-confetti";

export interface ConfettiRef {
    fire: (options?: ConfettiOptions) => void;
}

interface ConfettiProps extends ConfettiOptions {
    manualstart?: boolean;
}

const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
    ({ manualstart = false, ...options }, ref) => {
        const fire = useCallback(
            (opts: ConfettiOptions = {}) => {
                const combinedOptions = {
                    ...options,
                    ...opts,
                };
                void confetti(combinedOptions);
            },
            [options],
        );

        useImperativeHandle(ref, () => ({
            fire,
        }));

        useEffect(() => {
            if (!manualstart) {
                fire();
            }
        }, [fire, manualstart]);

        return null;
    },
);

Confetti.displayName = "Confetti";

export default Confetti;

// Função utilitária para disparar confetti rapidamente
export const fireConfetti = (options?: ConfettiOptions) => {
    const defaults: ConfettiOptions = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    };

    confetti({
        ...defaults,
        ...options
    });
};

// Efeito de fogos de artifício
export const fireFireworks = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
};

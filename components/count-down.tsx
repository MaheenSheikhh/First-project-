"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function Countdown() {
    const [duration, setDuration] = useState<number | string>(""); // Timer duration input
    const [timeLeft, setTimeLeft] = useState<number>(0); // Remaining time
    const [isActive, setIsActive] = useState<boolean>(false); // Timer active or not
    const [isPaused, setIsPaused] = useState<boolean>(false); // Timer paused or not
    const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference for clearing

    const handleSetDuration = (): void => {
        const parsedDuration = Number(duration);
        if (!isNaN(parsedDuration) && parsedDuration > 0) {
            setTimeLeft(parsedDuration);
            setIsActive(false);
            setIsPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const handleStart = (): void => {
        if (timeLeft > 0) {
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const handlePause = (): void => {
        if (isActive) {
            setIsActive(false);
            setIsPaused(true);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const handleReset = (): void => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(Number(duration) || 0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    useEffect(() => {
        if (isActive && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, isPaused]);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setDuration(Number(e.target.value) || "");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-sky-300">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-400">
                <h1 className="text-2xl font-bold mb-4 text-blue-800 text-center flex items-center justify-center">
                    🕒 Countdown Timer
                </h1>

                <div className="flex items-center mb-6">
                    <input
                        type="number"
                        id="duration"
                        placeholder="Enter duration in seconds"
                        value={duration}
                        onChange={handleDurationChange}
                        className="flex-1 mr-4 rounded-md border-gray-300 bg-gray-200 text-black"
                    />
                    <button onClick={handleSetDuration} className="text-black border border-gray-400 px-2 py-1 rounded-md">
                        Set
                    </button>
                </div>

                <div className="text-6xl font-bold text-black mb-8 text-center">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-4">
                    <button onClick={handleStart} className="text-black border border-gray-400 px-3 py-1 rounded-md">
                        {isPaused ? "Resume" : "Start"}
                    </button>
                    <button onClick={handlePause} className="text-black border border-gray-400 px-3 py-1 rounded-md">
                        Pause
                    </button>
                    <button onClick={handleReset} className="text-black border border-gray-400 px-3 py-1 rounded-md">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

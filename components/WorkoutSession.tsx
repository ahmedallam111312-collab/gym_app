import React, { useState, useEffect, useRef } from 'react';
import { DayPlan, WorkoutLog, LoggedExercise, LoggedSet } from '../types';

const REST_TIME_SECONDS = 60;

const Timer: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [secondsLeft, setSecondsLeft] = useState(REST_TIME_SECONDS);
    // Fix: Replaced NodeJS.Timeout with 'number' for browser compatibility.
    const intervalRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    playFinishSound();
                    onFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [onFinish]);
    
    const playFinishSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
    };

    const progress = (secondsLeft / REST_TIME_SECONDS) * 100;

    return (
        <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-secondary rounded-full">
                <div className="h-2 bg-primary rounded-full transition-all duration-1000 linear" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-sm font-mono text-primary">{`${Math.floor(secondsLeft / 60)}`.padStart(2, '0')}:{`${secondsLeft % 60}`.padStart(2, '0')}</span>
        </div>
    );
};

const WorkoutSession: React.FC<{
    dayPlan: DayPlan;
    planTitle: string;
    onFinish: (log: WorkoutLog) => void;
    onCancel: () => void;
}> = ({ dayPlan, planTitle, onFinish, onCancel }) => {
    const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>(
        dayPlan.exercises.map(ex => ({
            name: ex.name,
            sets: [{ reps: 0, weight: 0 }]
        }))
    );
    const [timerKey, setTimerKey] = useState<string | null>(null);

    const handleSetChange = (exIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
        const newLogs = [...loggedExercises];
        newLogs[exIndex].sets[setIndex][field] = value < 0 ? 0 : value;
        setLoggedExercises(newLogs);
    };
    
    const addSet = (exIndex: number) => {
        setTimerKey(`${exIndex}-${loggedExercises[exIndex].sets.length-1}`);
        const newLogs = [...loggedExercises];
        const lastSet = newLogs[exIndex].sets[newLogs[exIndex].sets.length - 1] || { reps: 0, weight: 0 };
        newLogs[exIndex].sets.push({ ...lastSet });
        setLoggedExercises(newLogs);
    };

    const removeSet = (exIndex: number, setIndex: number) => {
        const newLogs = [...loggedExercises];
        if (newLogs[exIndex].sets.length > 1) {
            newLogs[exIndex].sets.splice(setIndex, 1);
            setLoggedExercises(newLogs);
        }
    };
    
    const handleFinish = () => {
        const finalLog: WorkoutLog = {
            date: new Date().toISOString(),
            planTitle: planTitle,
            dayTitle: dayPlan.title,
            exercises: loggedExercises.map(ex => ({
                ...ex,
                sets: ex.sets.filter(s => s.reps > 0 || s.weight > 0) // Filter out empty sets
            })).filter(ex => ex.sets.length > 0),
        };
        onFinish(finalLog);
    };

    return (
        <div className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-1">Workout in Progress</h2>
            <p className="text-text-secondary mb-4">{dayPlan.title}</p>

            <div className="space-y-6">
                {dayPlan.exercises.map((exercise, exIndex) => (
                    <div key={exercise.name} className="bg-background p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-text-primary">{exercise.name}</h3>
                        <p className="text-sm text-text-secondary mb-3">{exercise.description}</p>
                        {loggedExercises[exIndex].sets.map((set, setIndex) => (
                            <div key={setIndex} className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-text-secondary w-5">{setIndex + 1}</span>
                                <input type="number" value={set.weight} onChange={e => handleSetChange(exIndex, setIndex, 'weight', Number(e.target.value))} className="w-20 bg-secondary p-2 rounded text-center" placeholder="kg" />
                                <span className="text-text-secondary">kg</span>
                                <input type="number" value={set.reps} onChange={e => handleSetChange(exIndex, setIndex, 'reps', Number(e.target.value))} className="w-20 bg-secondary p-2 rounded text-center" placeholder="reps" />
                                <span className="text-text-secondary">reps</span>
                                <button onClick={() => removeSet(exIndex, setIndex)} className="text-red-500 hover:text-red-400 text-2xl font-bold">&times;</button>
                            </div>
                        ))}
                        <div className="flex items-center gap-4 mt-2">
                             <button onClick={() => addSet(exIndex)} className="text-sm text-primary hover:text-primary-dark font-semibold">+ Add Set</button>
                             {timerKey === `${exIndex}-${loggedExercises[exIndex].sets.length-2}` && <Timer key={timerKey} onFinish={() => setTimerKey(null)} />}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-6">
                <button onClick={onCancel} className="flex-1 bg-secondary text-text-primary font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors transform hover:scale-105">Cancel</button>
                <button onClick={handleFinish} className="flex-1 bg-primary text-background font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors transform hover:scale-105">Finish & Log Workout</button>
            </div>
        </div>
    );
};

export default WorkoutSession;
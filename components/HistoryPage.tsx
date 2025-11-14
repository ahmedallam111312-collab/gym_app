
import React, { useMemo, useState } from 'react';
import { WorkoutLog, Achievement } from '../types';
import AchievementsList from './AchievementsList';

interface HistoryPageProps {
    workoutLogs: WorkoutLog[];
    achievements: Achievement[];
}

const PersonalRecords: React.FC<{ logs: WorkoutLog[] }> = ({ logs }) => {
    const prs = useMemo(() => {
        const records: { [key: string]: { weight: number; date: string } } = {};
        const keyLifts = ['squat', 'bench press', 'deadlift', 'overhead press', 'press', 'row'];

        logs.forEach(log => {
            log.exercises.forEach(exercise => {
                const exerciseNameLower = exercise.name.toLowerCase();
                // Find a key lift that is a substring of the exercise name
                const matchedKeyLift = keyLifts.find(lift => exerciseNameLower.includes(lift));
                
                if (matchedKeyLift) {
                    const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
                    // Use a more generic name for PR to group similar exercises (e.g., "Barbell Squat" and "Squat" become "Squat")
                    const prName = exercise.name;
                    if (!records[prName] || maxWeight > records[prName].weight) {
                        records[prName] = { weight: maxWeight, date: log.date };
                    }
                }
            });
        });
        return Object.entries(records).sort((a,b) => b[1].weight - a[1].weight);
    }, [logs]);

    if (prs.length === 0) return null;

    return (
        <div className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Personal Records</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prs.map(([name, record]) => (
                    <div key={name} className="bg-background p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
                        <p className="font-bold text-primary text-lg truncate">{name}</p>
                        <p className="text-3xl font-bold text-text-primary">{record.weight} kg</p>
                        <p className="text-xs text-text-secondary">Set on {new Date(record.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const HistoryPage: React.FC<HistoryPageProps> = ({ workoutLogs, achievements }) => {
    const [expandedLog, setExpandedLog] = useState<string | null>(null);

    const toggleLogExpansion = (date: string) => {
        setExpandedLog(expandedLog === date ? null : date);
    };

    return (
        <div className="flex flex-col gap-8">
            <AchievementsList achievements={achievements} />
            <PersonalRecords logs={workoutLogs} />
            <div className="bg-card p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Workout History</h2>
                {workoutLogs.length > 0 ? (
                    <div className="space-y-4">
                        {workoutLogs.map((log) => (
                            <div key={log.date} className="bg-background rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                                <button
                                    onClick={() => toggleLogExpansion(log.date)}
                                    className="w-full text-left p-4 flex justify-between items-center hover:bg-secondary transition-colors"
                                >
                                    <div>
                                        <p className="font-bold text-text-primary">{log.planTitle}</p>
                                        <p className="text-sm text-text-secondary">{log.dayTitle} - {new Date(log.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`transform transition-transform duration-300 ${expandedLog === log.date ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {expandedLog === log.date && (
                                    <div className="p-4 border-t border-secondary">
                                        <ul className="space-y-3">
                                            {log.exercises.map((ex, i) => (
                                                <li key={i}>
                                                    <p className="font-semibold text-primary">{ex.name}</p>
                                                    <p className="text-sm text-text-secondary">
                                                        {ex.sets.map(s => `${s.reps} reps @ ${s.weight}kg`).join(' / ')}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-secondary text-center py-8">No workouts logged yet. Go complete a workout on the dashboard!</p>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;

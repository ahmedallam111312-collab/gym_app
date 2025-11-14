import React, { useState } from 'react';
import { ActiveWorkoutPlan, DayPlan, WorkoutLog } from '../types';
import Exercise from './Exercise';
import DumbbellIcon from './icons/DumbbellIcon';
import WorkoutSession from './WorkoutSession';

interface ActiveWorkoutPlanDisplayProps {
    plan: ActiveWorkoutPlan;
    onClearPlan: () => void;
    onUpdateExerciseImage: (exerciseName: string, imageUrl: string) => void;
    onLogWorkout: (log: WorkoutLog) => void;
}

const ActiveWorkoutPlanDisplay: React.FC<ActiveWorkoutPlanDisplayProps> = ({ plan, onClearPlan, onUpdateExerciseImage, onLogWorkout }) => {
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const [isWorkoutInProgress, setIsWorkoutInProgress] = useState(false);
    
    const activeDay: DayPlan = plan.days[activeDayIndex];
    
    const handleStartWorkout = () => {
        setIsWorkoutInProgress(true);
    };

    const handleFinishWorkout = (log: WorkoutLog) => {
        onLogWorkout(log);
        setIsWorkoutInProgress(false);
    };

    if (isWorkoutInProgress) {
        return (
            <WorkoutSession 
                dayPlan={activeDay}
                planTitle={plan.title}
                onFinish={handleFinishWorkout}
                onCancel={() => setIsWorkoutInProgress(false)}
            />
        );
    }

    return (
        <div className="bg-card p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                 <div className="flex items-center gap-3">
                    <DumbbellIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-text-primary">{plan.title}</h2>
                </div>
                <button
                    onClick={onClearPlan}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Choose New Plan
                </button>
            </div>
            
            <div className="flex flex-wrap border-b border-secondary mb-4">
                {plan.days.map((day, index) => (
                    <button
                        key={day.day}
                        onClick={() => setActiveDayIndex(index)}
                        className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                            activeDayIndex === index
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                       Day {day.day}: {day.title}
                    </button>
                ))}
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-text-primary">{activeDay.title}</h3>
                    <button onClick={handleStartWorkout} className="bg-primary text-background font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                        Start Workout
                    </button>
                </div>
                <div className="space-y-4">
                    {activeDay.exercises.map((exercise) => (
                        <Exercise 
                            key={`${activeDayIndex}-${exercise.name}`}
                            exercise={exercise}
                            onUpdateImage={onUpdateExerciseImage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActiveWorkoutPlanDisplay;
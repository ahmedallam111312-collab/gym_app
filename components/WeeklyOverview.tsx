
import React from 'react';
import { Meal, WorkoutLog } from '../types';
import CheckIcon from './icons/CheckIcon';

interface WeeklyOverviewProps {
    meals: Meal[];
    workoutLogs: WorkoutLog[];
    dailyCalorieGoal: number;
}

const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ meals, workoutLogs, dailyCalorieGoal }) => {

    const getPastSevenDays = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push({
                date: d.toISOString().split('T')[0],
                dayName: d.toLocaleDateString(undefined, { weekday: 'short' })[0], // Just the first letter
            });
        }
        return days;
    };

    const pastSevenDays = getPastSevenDays();

    const data = pastSevenDays.map(dayInfo => {
        const workedOut = workoutLogs.some(log => log.date.startsWith(dayInfo.date));
        const caloriesConsumed = meals
            .filter(meal => meal.date === dayInfo.date)
            .reduce((sum, meal) => sum + meal.totalCalories, 0);
        
        const adherence = dailyCalorieGoal > 0 ? (caloriesConsumed / dailyCalorieGoal) * 100 : 0;
        
        let color = 'bg-gray-500'; // Default for no data
        if (caloriesConsumed > 0) {
            if (adherence >= 90 && adherence <= 110) color = 'bg-primary'; // Green for on-track
            else if (adherence > 110) color = 'bg-red-500'; // Red for over
            else color = 'bg-yellow-500'; // Yellow for under
        }

        return {
            ...dayInfo,
            workedOut,
            calorieColor: color,
        };
    });

    return (
        <div className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-text-primary mb-4">Weekly Snapshot</h2>
            <div className="flex justify-around items-center">
                {data.map(({ date, dayName, workedOut, calorieColor }) => (
                    <div key={date} className="flex flex-col items-center gap-2 text-center">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                             <div className={`w-8 h-8 rounded-full ${calorieColor} transition-colors duration-300`}></div>
                             {workedOut && (
                                <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full p-0.5">
                                    <CheckIcon className="w-4 h-4 text-primary" />
                                </div>
                             )}
                        </div>
                        <p className="text-xs font-semibold text-text-secondary">{dayName}</p>
                    </div>
                ))}
            </div>
             <div className="flex justify-center items-center gap-4 mt-4 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> On Target</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Under</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Over</span>
                <span className="flex items-center gap-1.5"><CheckIcon className="w-3 h-3 text-primary"/> Workout</span>
            </div>
        </div>
    );
};

export default WeeklyOverview;

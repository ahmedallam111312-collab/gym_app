
import React, { useMemo } from 'react';
import { UserProfile, Meal, ActiveWorkoutPlan, WorkoutLog } from '../types';
import DailyStats from './DailyStats';
import MealLogger from './MealLogger';
import ActiveWorkoutPlanDisplay from './ActiveWorkoutPlanDisplay';
import WeeklyOverview from './WeeklyOverview';

interface DashboardProps {
    userProfile: UserProfile;
    meals: Meal[];
    addMeal: (meal: Omit<Meal, 'date'>) => void;
    dailyCalorieGoal: number;
    activePlan: ActiveWorkoutPlan | null;
    onClearPlan: () => void;
    onUpdateExerciseImage: (exerciseName: string, imageUrl: string) => void;
    onLogWorkout: (log: WorkoutLog) => void;
    workoutLogs: WorkoutLog[];
}

const TodaysMeals: React.FC<{ meals: Meal[] }> = ({ meals }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(meal => meal.date === today);

    if (todaysMeals.length === 0) {
        return null;
    }

    return (
        <div className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Today's Logged Meals</h2>
            <div className="flex overflow-x-auto gap-4 pb-4">
                {todaysMeals.map((meal, index) => (
                    <div key={index} className="flex-shrink-0 w-48 bg-background rounded-lg shadow-md p-3 text-center transform hover:scale-105 transition-transform duration-300">
                        <img src={meal.image} alt="Logged meal" className="w-full h-24 object-cover rounded-md mb-2" />
                        <p className="font-bold text-primary">{meal.totalCalories.toFixed(0)} kcal</p>
                        <p className="text-xs text-text-secondary truncate" title={meal.items.map(i => i.name).join(', ')}>
                            {meal.items.map(i => i.name).join(', ')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ userProfile, meals, addMeal, dailyCalorieGoal, activePlan, onClearPlan, onUpdateExerciseImage, onLogWorkout, workoutLogs }) => {
    
    const totalCaloriesConsumedToday = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return meals
            .filter(meal => meal.date === today)
            .reduce((total, meal) => total + meal.totalCalories, 0);
    }, [meals]);

    return (
        <div className="flex flex-col gap-6">
            <DailyStats
                goal={dailyCalorieGoal}
                consumed={totalCaloriesConsumedToday}
                userProfile={userProfile}
            />

            <WeeklyOverview meals={meals} workoutLogs={workoutLogs} dailyCalorieGoal={dailyCalorieGoal} />
            
            <TodaysMeals meals={meals} />

            {activePlan ? (
                <ActiveWorkoutPlanDisplay 
                    plan={activePlan} 
                    onClearPlan={onClearPlan}
                    onUpdateExerciseImage={onUpdateExerciseImage}
                    onLogWorkout={onLogWorkout}
                />
            ) : (
                <div className="bg-card p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">No Active Workout Plan</h2>
                    <p className="text-text-secondary mb-4">Visit the Workout Library to choose a new program!</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                     <MealLogger addMeal={addMeal} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

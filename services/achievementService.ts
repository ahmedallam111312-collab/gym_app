
import { Achievement, WorkoutLog, Meal, WeightLogEntry } from '../types';
import TrophyIcon from '../components/icons/TrophyIcon';
import FirstWorkoutIcon from '../components/icons/FirstWorkoutIcon';
import ConsistentWeekIcon from '../components/icons/ConsistentWeekIcon';
import CalorieConsciousIcon from '../components/icons/CalorieConsciousIcon';
import PRBreakerIcon from '../components/icons/PRBreakerIcon';

const ACHIEVEMENTS_KEY = 'achievements';

const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
    {
        id: 'first_workout',
        title: 'First Step',
        description: 'Complete your first workout.',
        icon: FirstWorkoutIcon,
    },
    {
        id: 'consistent_week',
        title: 'Weekly Warrior',
        description: 'Work out on 3 different days in a week.',
        icon: ConsistentWeekIcon,
    },
    {
        id: 'calorie_conscious',
        title: 'Mindful Eater',
        description: 'Log meals for 5 consecutive days.',
        icon: CalorieConsciousIcon,
    },
    {
        id: 'pr_breaker',
        title: 'New Heights',
        description: 'Set a new Personal Record in a key lift.',
        icon: PRBreakerIcon,
    },
    // Add more achievements here
];

interface UserData {
    workoutLogs: WorkoutLog[];
    meals: Meal[];
    weightLog: WeightLogEntry[];
}

export const checkAndUnlockAchievements = (data: UserData, currentAchievements: Achievement[]): Achievement[] => {
    const newAchievements = [...currentAchievements];
    
    // First Workout
    const firstWorkout = newAchievements.find(a => a.id === 'first_workout');
    if (firstWorkout && !firstWorkout.unlocked && data.workoutLogs.length > 0) {
        firstWorkout.unlocked = true;
    }
    
    // Consistent Week
    const consistentWeek = newAchievements.find(a => a.id === 'consistent_week');
    if (consistentWeek && !consistentWeek.unlocked) {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const recentWorkouts = data.workoutLogs.filter(log => new Date(log.date) >= last7Days);
        const uniqueDays = new Set(recentWorkouts.map(log => new Date(log.date).toDateString()));
        if (uniqueDays.size >= 3) {
            consistentWeek.unlocked = true;
        }
    }

    // Calorie Conscious
    const calorieConscious = newAchievements.find(a => a.id === 'calorie_conscious');
    if (calorieConscious && !calorieConscious.unlocked) {
        const mealDates = new Set(data.meals.map(meal => meal.date));
        if(mealDates.size > 0) {
            const sortedDates = Array.from(mealDates).sort();
            let consecutiveDays = 0;
            let maxConsecutive = 0;
            for (let i = 0; i < sortedDates.length; i++) {
                if (i > 0) {
                    const prevDate = new Date(sortedDates[i-1]);
                    const currDate = new Date(sortedDates[i]);
                    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        consecutiveDays++;
                    } else {
                        consecutiveDays = 1;
                    }
                } else {
                    consecutiveDays = 1;
                }
                maxConsecutive = Math.max(maxConsecutive, consecutiveDays);
            }
            if(maxConsecutive >= 5) {
                calorieConscious.unlocked = true;
            }
        }
    }

    // PR Breaker
    const prBreaker = newAchievements.find(a => a.id === 'pr_breaker');
    if (prBreaker && !prBreaker.unlocked) {
        // This is a simplified check. A true PR requires comparing to previous logs.
        // We'll unlock it if there's at least one log with a key lift.
        const hasKeyLift = data.workoutLogs.some(log => 
            log.exercises.some(ex => 
                /squat|bench press|deadlift|overhead press/i.test(ex.name)
            )
        );
        if (hasKeyLift) {
            prBreaker.unlocked = true;
        }
    }

    return newAchievements;
};


export const loadAchievements = (): Achievement[] => {
    try {
        const savedStatusRaw = localStorage.getItem(ACHIEVEMENTS_KEY);
        const savedStatus: { id: string; unlocked: boolean }[] = savedStatusRaw ? JSON.parse(savedStatusRaw) : [];
        
        return ALL_ACHIEVEMENTS.map(def => {
            const saved = savedStatus.find(s => s.id === def.id);
            return {
                ...def,
                unlocked: saved ? saved.unlocked : false,
            };
        });
    } catch (error) {
        console.error("Failed to load achievements, returning default set:", error);
        return ALL_ACHIEVEMENTS.map(def => ({ ...def, unlocked: false }));
    }
};


import { UserProfile, Meal, ChatMessage, ActiveWorkoutPlan, WorkoutLog, WeightLogEntry, Achievement } from '../types';
import { PRELOADED_IMAGES } from './preloadedImages';

const USER_PROFILE_KEY = 'userProfile';
const MEALS_KEY = 'meals';
const CHAT_HISTORY_KEY = 'chatHistory';
const ACTIVE_WORKOUT_PLAN_KEY = 'activeWorkoutPlan';
const EXERCISE_IMAGE_CACHE_KEY = 'exerciseImageCache';
const WORKOUT_LOGS_KEY = 'workoutLogs';
const WEIGHT_LOG_KEY = 'weightLog';
const ACHIEVEMENTS_KEY = 'achievements';
const HONOR_HEALTH_CONNECTED_KEY = 'honorHealthConnected';


// User Profile Functions
export const saveUserProfile = (profile: UserProfile): void => {
    try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.error("Failed to save user profile:", error);
    }
};

export const loadUserProfile = (): UserProfile | null => {
    try {
        const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
        return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (error) {
        console.error("Failed to load user profile:", error);
        return null;
    }
};

// Meal Functions
export const saveMeals = (meals: Meal[]): void => {
    try {
        localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
    } catch (error) {
        console.error("Failed to save meals:", error);
    }
};

export const loadMeals = (): Meal[] => {
    try {
        const savedMeals = localStorage.getItem(MEALS_KEY);
        return savedMeals ? JSON.parse(savedMeals) : [];
    } catch (error) {
        console.error("Failed to load meals:", error);
        return [];
    }
};

// Chat History Functions
export const saveChatHistory = (messages: ChatMessage[]): void => {
    try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error("Failed to save chat history:", error);
    }
};

export const loadChatHistory = (): ChatMessage[] => {
    try {
        const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
        console.error("Failed to load chat history:", error);
        return [];
    }
};

// Active Workout Plan Functions
export const saveActiveWorkoutPlan = (plan: ActiveWorkoutPlan): void => {
    try {
        localStorage.setItem(ACTIVE_WORKOUT_PLAN_KEY, JSON.stringify(plan));
    } catch (error) {
        console.error("Failed to save active workout plan:", error);
    }
};

export const loadActiveWorkoutPlan = (): ActiveWorkoutPlan | null => {
    try {
        const savedPlan = localStorage.getItem(ACTIVE_WORKOUT_PLAN_KEY);
        return savedPlan ? JSON.parse(savedPlan) : null;
    } catch (error) {
        console.error("Failed to load active workout plan:", error);
        return null;
    }
};

// Exercise Image Cache Functions
export const saveExerciseImageCache = (cache: { [key: string]: string }): void => {
    try {
        localStorage.setItem(EXERCISE_IMAGE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error("Failed to save exercise image cache:", error);
    }
};

export const loadExerciseImageCache = (): { [key: string]: string } => {
    try {
        const savedCache = localStorage.getItem(EXERCISE_IMAGE_CACHE_KEY);
        return savedCache ? JSON.parse(savedCache) : {};
    } catch (error) {
        console.error("Failed to load exercise image cache:", error);
        return {};
    }
};

export const initializeImageCache = (): void => {
    const cache = loadExerciseImageCache();
    if (Object.keys(cache).length === 0) { // Only initialize if cache is empty
        console.log("Initializing exercise image cache with pre-loaded images.");
        saveExerciseImageCache(PRELOADED_IMAGES);
    }
};


// Workout Log Functions
export const saveWorkoutLogs = (logs: WorkoutLog[]): void => {
    try {
        localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
        console.error("Failed to save workout logs:", error);
    }
};

export const loadWorkoutLogs = (): WorkoutLog[] => {
    try {
        const savedLogs = localStorage.getItem(WORKOUT_LOGS_KEY);
        return savedLogs ? JSON.parse(savedLogs) : [];
    } catch (error) {
        console.error("Failed to load workout logs:", error);
        return [];
    }
};

// Weight Log Functions
export const saveWeightLog = (log: WeightLogEntry[]): void => {
    try {
        localStorage.setItem(WEIGHT_LOG_KEY, JSON.stringify(log));
    } catch (error) {
        console.error("Failed to save weight log:", error);
    }
};

export const loadWeightLog = (): WeightLogEntry[] => {
    try {
        const savedLog = localStorage.getItem(WEIGHT_LOG_KEY);
        return savedLog ? JSON.parse(savedLog) : [];
    } catch (error) {
        console.error("Failed to load weight log:", error);
        return [];
    }
};

// Achievements Functions
export const saveAchievements = (achievements: Achievement[]): void => {
    try {
        // Only store the unlocked status to save space and keep definitions in code
        const achievementStatus = achievements.map(a => ({ id: a.id, unlocked: a.unlocked }));
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievementStatus));
    } catch (error) {
        console.error("Failed to save achievements:", error);
    }
};

export const loadAchievements = (): Achievement[] => {
    // This function will be defined in the achievement service to merge saved data with definitions
    return []; // Initial load will be handled by the service
};

// Honor Health Connection Status
export const saveHonorHealthConnectionStatus = (status: boolean): void => {
    try {
        localStorage.setItem(HONOR_HEALTH_CONNECTED_KEY, JSON.stringify(status));
    } catch (error) {
        console.error("Failed to save Honor Health connection status:", error);
    }
};

export const loadHonorHealthConnectionStatus = (): boolean => {
    try {
        const savedStatus = localStorage.getItem(HONOR_HEALTH_CONNECTED_KEY);
        return savedStatus ? JSON.parse(savedStatus) : false;
    } catch (error) {
        console.error("Failed to load Honor Health connection status:", error);
        return false;
    }
};


import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { UserProfile, Meal, ActiveWorkoutPlan, WorkoutLog, WeightLogEntry, Achievement } from './types';
import UserProfileForm from './components/UserProfileForm';
import { calculateTDEE } from './services/fitnessService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProgressPage from './components/ProgressPage';
import WorkoutLibrary from './components/WorkoutLibrary';
import AICoachPage from './components/AICoachPage';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import { 
  loadUserProfile, saveUserProfile, 
  loadMeals, saveMeals, 
  loadActiveWorkoutPlan, saveActiveWorkoutPlan, 
  loadExerciseImageCache, saveExerciseImageCache,
  initializeImageCache,
  loadWorkoutLogs, saveWorkoutLogs,
  loadWeightLog, saveWeightLog,
  loadAchievements, saveAchievements,
  loadHonorHealthConnectionStatus, saveHonorHealthConnectionStatus,
} from './services/storageService';
import { checkAndUnlockAchievements } from './services/achievementService';

export type Page = 'dashboard' | 'progress' | 'workouts' | 'coach' | 'history' | 'settings';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [page, setPage] = useState<Page>('dashboard');
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState<ActiveWorkoutPlan | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [weightLog, setWeightLog] = useState<WeightLogEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isHonorHealthConnected, setIsHonorHealthConnected] = useState<boolean>(false);


  useEffect(() => {
    // Initialize data from localStorage on first load
    const profile = loadUserProfile();
    if (profile) setUserProfile(profile);

    setMeals(loadMeals());
    setActiveWorkoutPlan(loadActiveWorkoutPlan());
    setWorkoutLogs(loadWorkoutLogs());
    setWeightLog(loadWeightLog());
    setAchievements(loadAchievements());
    setIsHonorHealthConnected(loadHonorHealthConnectionStatus());
    
    // Pre-populate image cache if it's the first time
    initializeImageCache();
  }, []);

  // Effect to check for new achievements when data changes
  useEffect(() => {
    const updatedAchievements = checkAndUnlockAchievements({
      workoutLogs,
      meals,
      weightLog,
    }, achievements);
    
    // Check if there are actual changes to avoid unnecessary re-renders/saves
    const hasChanged = JSON.stringify(updatedAchievements) !== JSON.stringify(achievements);
    if(hasChanged) {
        setAchievements(updatedAchievements);
        saveAchievements(updatedAchievements);
    }
  }, [workoutLogs, meals, weightLog]);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
    // Add initial weight to log
    const initialWeightEntry: WeightLogEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: profile.weight
    };
    const newWeightLog = [initialWeightEntry];
    setWeightLog(newWeightLog);
    saveWeightLog(newWeightLog);
  };

  const handleProfileClear = () => {
    localStorage.clear();
    window.location.reload();
  };

  const addMeal = useCallback((newMeal: Omit<Meal, 'date'>) => {
    setMeals(prevMeals => {
      const mealWithDate: Meal = {
        ...newMeal,
        date: new Date().toISOString().split('T')[0],
      };
      const updatedMeals = [...prevMeals, mealWithDate];
      saveMeals(updatedMeals);
      return updatedMeals;
    });
  }, []);

  const addWorkoutLog = useCallback((newLog: WorkoutLog) => {
    setWorkoutLogs(prevLogs => {
      const updatedLogs = [...prevLogs, newLog].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      saveWorkoutLogs(updatedLogs);
      return updatedLogs;
    });
  }, []);

  const addWeightLogEntry = useCallback((newEntry: WeightLogEntry) => {
    setWeightLog(prevLog => {
      // Avoid duplicate entries on the same day by replacing if date exists
      const existingIndex = prevLog.findIndex(entry => entry.date === newEntry.date);
      let updatedLog;
      if (existingIndex > -1) {
        updatedLog = [...prevLog];
        updatedLog[existingIndex] = newEntry;
      } else {
        updatedLog = [...prevLog, newEntry];
      }
      updatedLog.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      saveWeightLog(updatedLog);
      return updatedLog;
    });
  }, []);


  const handleSetPlan = (plan: ActiveWorkoutPlan) => {
      setActiveWorkoutPlan(plan);
      saveActiveWorkoutPlan(plan);
      setPage('dashboard');
  };

  const handleClearPlan = () => {
      setActiveWorkoutPlan(null);
      localStorage.removeItem('activeWorkoutPlan');
  };

  const handleUpdateExerciseImage = (exerciseName: string, imageUrl: string) => {
    const cache = loadExerciseImageCache();
    cache[exerciseName] = imageUrl;
    saveExerciseImageCache(cache);

    if (activeWorkoutPlan) {
        const updatedPlan = {
            ...activeWorkoutPlan,
            days: activeWorkoutPlan.days.map(day => ({
                ...day,
                exercises: day.exercises.map(ex => 
                    ex.name === exerciseName ? { ...ex, imageUrl } : ex
                )
            }))
        };
        setActiveWorkoutPlan(updatedPlan);
        saveActiveWorkoutPlan(updatedPlan);
    }
  };
  
  const handleConnectHonorHealth = () => {
      setIsHonorHealthConnected(true);
      saveHonorHealthConnectionStatus(true);
  };

  const handleDisconnectHonorHealth = () => {
      setIsHonorHealthConnected(false);
      saveHonorHealthConnectionStatus(false);
  };

  const dailyCalorieGoal = useMemo(() => {
    if (!userProfile) return 0;
    return calculateTDEE(userProfile);
  }, [userProfile]);


  const renderPage = () => {    
    switch (page) {
      case 'progress':
        return <ProgressPage meals={meals} dailyGoal={dailyCalorieGoal} weightLog={weightLog} onAddWeight={addWeightLogEntry} />;
      case 'workouts':
        return <WorkoutLibrary onSetPlan={handleSetPlan} />;
      case 'coach':
        return <AICoachPage 
            userProfile={userProfile!} 
            meals={meals}
            activeWorkoutPlan={activeWorkoutPlan}
            workoutLogs={workoutLogs}
            weightLog={weightLog}
        />;
      case 'history':
        return <HistoryPage workoutLogs={workoutLogs} achievements={achievements} />;
      case 'settings':
        return <SettingsPage 
            isHonorHealthConnected={isHonorHealthConnected}
            onConnect={handleConnectHonorHealth}
            onDisconnect={handleDisconnectHonorHealth}
        />;
      case 'dashboard':
      default:
        return (
            <Dashboard 
                userProfile={userProfile!}
                meals={meals}
                addMeal={addMeal}
                dailyCalorieGoal={dailyCalorieGoal}
                activePlan={activeWorkoutPlan}
                onClearPlan={handleClearPlan}
                onUpdateExerciseImage={handleUpdateExerciseImage}
                onLogWorkout={addWorkoutLog}
                workoutLogs={workoutLogs}
            />
        );
    }
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <UserProfileForm onSave={handleProfileSave} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onClearProfile={handleProfileClear} 
        currentPage={page}
        setPage={setPage}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;

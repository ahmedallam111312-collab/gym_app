
import React, { useState } from 'react';
import { generateStructuredWorkoutPlan } from '../services/geminiService';
import { loadExerciseImageCache } from '../services/storageService';
import Loader from './Loader';
import DumbbellIcon from './icons/DumbbellIcon';
import { ActiveWorkoutPlan } from '../types';
import WorkoutPlanner from './WorkoutPlanner';

interface WorkoutLibraryProps {
    onSetPlan: (plan: ActiveWorkoutPlan) => void;
}

const workoutCategories = [
    { title: "Muscle Gain", prompt: "A 5-day split workout plan focused on hypertrophy for muscle gain." },
    { title: "Fat Loss", prompt: "A 4-week workout plan combining HIIT and strength training for effective fat loss." },
    { title: "Full Body Strength", prompt: "A 3-day per week full-body strength training program for beginners." },
    { title: "Home Workout", prompt: "A challenging 30-minute bodyweight-only workout plan that can be done at home." },
    { title: "Quick HIIT", prompt: "A 20-minute high-intensity interval training (HIIT) session for a quick cardio burn." },
    { title: "Core Strength", prompt: "A dedicated core and abs workout routine to build a strong midsection." },
];

const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({ onSetPlan }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handleSelectPlan = async (title: string, prompt: string) => {
        setIsLoading(true);
        setError(null);
        setActiveCategory(title);
        try {
            // Step 1: Generate the plan structure from the AI
            const plan = await generateStructuredWorkoutPlan(prompt);
            
            // Step 2: Check the local cache for existing images
            const imageCache = loadExerciseImageCache();
            
            const planWithCachedImages: ActiveWorkoutPlan = {
                ...plan,
                days: plan.days.map(day => ({
                    ...day,
                    exercises: day.exercises.map(ex => ({
                        ...ex,
                        imageUrl: imageCache[ex.name] // Assign imageUrl if found in cache, otherwise it's undefined
                    }))
                }))
            };
            
            // Step 3: Set the plan. The UI will prompt for any missing images.
            onSetPlan(planWithCachedImages);

        } catch (err) {
            setError('Failed to generate workout program. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setActiveCategory(null);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-card p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <DumbbellIcon className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-bold text-text-primary">Workout Program Library</h2>
                </div>
                <p className="text-text-secondary mb-6">
                    Select a category to generate a full, multi-day workout program. This will become your active plan. For any exercises without a visual, you'll be prompted to upload your own.
                </p>

                {isLoading && (
                    <Loader 
                        message={`Building your '${activeCategory}' program...`} 
                    />
                )}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {!isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workoutCategories.map(({ title, prompt }) => (
                            <button
                                key={title}
                                onClick={() => handleSelectPlan(title, prompt)}
                                disabled={isLoading}
                                className="p-6 bg-secondary hover:bg-background border border-transparent hover:border-primary rounded-lg text-left transition-all duration-300 group disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{title}</h3>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-lg">
                 <h2 className="text-2xl font-bold text-text-primary mb-2">Need a Single Workout?</h2>
                <p className="text-text-secondary mb-4">
                    Use the planner below to generate a one-off workout for today without changing your active program.
                </p>
                <WorkoutPlanner />
            </div>
        </div>
    );
};

export default WorkoutLibrary;

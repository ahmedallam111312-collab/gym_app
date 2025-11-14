import React from 'react';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ActivityLevel {
  SEDENTARY = 1.2,
  LIGHTLY_ACTIVE = 1.375,
  MODERATELY_ACTIVE = 1.55,
  VERY_ACTIVE = 1.725,
  SUPER_ACTIVE = 1.9,
}

export interface UserProfile {
  age: number;
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  activityLevel: ActivityLevel;
}

export interface FoodItem {
  name: string;
  calories: number;
  grams: number;
}

export interface Meal {
  totalCalories: number;
  items: FoodItem[];
  image: string; // base64 image data
  date: string; // YYYY-MM-DD format
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface Exercise {
    name: string;
    description: string;
    imageUrl?: string;
}

export interface DayPlan {
    day: number;
    title: string;
    exercises: Exercise[];
}

export interface ActiveWorkoutPlan {
    title:string;
    days: DayPlan[];
}

export interface WeightLogEntry {
    date: string; // YYYY-MM-DD
    weight: number; // in kg
}

export interface LoggedSet {
    reps: number;
    weight: number;
}

export interface LoggedExercise {
    name: string;
    sets: LoggedSet[];
}

export interface WorkoutLog {
    date: string; // YYYY-MM-DD
    planTitle: string;
    dayTitle: string;
    exercises: LoggedExercise[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  // Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  unlocked: boolean;
}

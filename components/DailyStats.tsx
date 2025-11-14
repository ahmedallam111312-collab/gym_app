
import React from 'react';
import { UserProfile } from '../types';

interface DailyStatsProps {
  goal: number;
  consumed: number;
  userProfile: UserProfile;
}

const DailyStats: React.FC<DailyStatsProps> = ({ goal, consumed, userProfile }) => {
  const remaining = goal - consumed;
  const progress = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
  
  // ~7700 calories in 1kg of fat. Projected weekly change.
  const weeklyWeightChange = ((consumed - goal) * 7) / 7700;

  const getWeightChangeText = () => {
    if (goal === 0) return "Set profile to see projection.";
    if (Math.abs(weeklyWeightChange) < 0.05) {
      return "You are maintaining your current weight.";
    }
    const action = weeklyWeightChange > 0 ? "gain" : "lose";
    return `You're on track to ${action} ~${Math.abs(weeklyWeightChange).toFixed(2)} kg this week.`;
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Your Daily Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-background rounded-lg">
          <p className="text-sm text-text-secondary font-medium">Calorie Goal</p>
          <p className="text-3xl font-bold text-primary">{goal.toFixed(0)}</p>
          <p className="text-xs text-text-secondary">kcal / day</p>
        </div>
        <div className="p-4 bg-background rounded-lg">
          <p className="text-sm text-text-secondary font-medium">Consumed</p>
          <p className="text-3xl font-bold text-text-primary">{consumed.toFixed(0)}</p>
          <p className="text-xs text-text-secondary">kcal</p>
        </div>
        <div className="p-4 bg-background rounded-lg">
          <p className="text-sm text-text-secondary font-medium">Remaining</p>
          <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-primary' : 'text-red-500'}`}>{remaining.toFixed(0)}</p>
          <p className="text-xs text-text-secondary">kcal</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="w-full bg-background rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="mt-4 text-center text-text-secondary text-sm">
        <p>{getWeightChangeText()}</p>
      </div>
    </div>
  );
};

export default DailyStats;

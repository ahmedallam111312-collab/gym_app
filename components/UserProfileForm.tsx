
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel } from '../types';

interface UserProfileFormProps {
  onSave: (profile: UserProfile) => void;
}

const activityLevelDescriptions: { [key in ActivityLevel]: string } = {
    [ActivityLevel.SEDENTARY]: "Sedentary (little or no exercise)",
    [ActivityLevel.LIGHTLY_ACTIVE]: "Lightly active (light exercise/sports 1-3 days/week)",
    [ActivityLevel.MODERATELY_ACTIVE]: "Moderately active (moderate exercise/sports 3-5 days/week)",
    [ActivityLevel.VERY_ACTIVE]: "Very active (hard exercise/sports 6-7 days a week)",
    [ActivityLevel.SUPER_ACTIVE]: "Super active (very hard exercise/physical job & exercise)",
};

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSave }) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    gender: Gender.MALE,
    weight: 70,
    height: 175,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'gender' || name === 'activityLevel' ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.age <= 0 || profile.weight <= 0 || profile.height <= 0) {
        setError('Please enter valid positive numbers for age, weight, and height.');
        return;
    }
    setError('');
    onSave(profile);
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-card rounded-xl shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary">Welcome to Gemini Fitness Pal</h2>
        <p className="mt-2 text-text-secondary">Let's set up your profile to personalize your experience.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-text-secondary">Age</label>
                <input type="number" name="age" id="age" value={profile.age} onChange={handleChange} className="mt-1 block w-full bg-background border border-secondary rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-text-secondary">Gender</label>
                <select name="gender" id="gender" value={profile.gender} onChange={handleChange} className="mt-1 block w-full bg-background border border-secondary rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary">
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-text-secondary">Weight (kg)</label>
                <input type="number" name="weight" id="weight" value={profile.weight} onChange={handleChange} className="mt-1 block w-full bg-background border border-secondary rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
                <label htmlFor="height" className="block text-sm font-medium text-text-secondary">Height (cm)</label>
                <input type="number" name="height" id="height" value={profile.height} onChange={handleChange} className="mt-1 block w-full bg-background border border-secondary rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
        </div>

        <div>
          <label htmlFor="activityLevel" className="block text-sm font-medium text-text-secondary">Activity Level</label>
          <select name="activityLevel" id="activityLevel" value={profile.activityLevel} onChange={handleChange} className="mt-1 block w-full bg-background border border-secondary rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary">
            {Object.entries(activityLevelDescriptions).map(([level, desc]) => (
                <option key={level} value={level}>{desc}</option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors duration-300">
            Save Profile & Start
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;


import React from 'react';
import { Achievement } from '../types';
import TrophyIcon from './icons/TrophyIcon';

interface AchievementsListProps {
    achievements: Achievement[];
}

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const Icon = achievement.unlocked ? achievement.icon : TrophyIcon;
    
    return (
        <div className={`bg-background p-4 rounded-lg text-center flex flex-col items-center justify-start border-2 ${achievement.unlocked ? 'border-primary' : 'border-secondary'} transition-all duration-500 transform ${achievement.unlocked ? 'scale-100' : 'opacity-60'}`}>
            <div className={`w-16 h-16 mb-3 flex items-center justify-center rounded-full ${achievement.unlocked ? 'bg-primary/20' : 'bg-secondary'}`}>
                <Icon className={`w-10 h-10 ${achievement.unlocked ? 'text-primary' : 'text-text-secondary'}`} />
            </div>
            <h3 className="font-bold text-md text-text-primary">{achievement.title}</h3>
            <p className="text-xs text-text-secondary mt-1">{achievement.description}</p>
        </div>
    )
}

const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
    return (
        <div className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {achievements.map(ach => (
                    <AchievementCard key={ach.id} achievement={ach} />
                ))}
            </div>
        </div>
    );
};

export default AchievementsList;


import React, { useRef } from 'react';
import { Exercise as ExerciseType } from '../types';
import CameraIcon from './icons/CameraIcon';

interface ExerciseProps {
    exercise: ExerciseType;
    onUpdateImage: (exerciseName: string, imageUrl: string) => void;
}

const Exercise: React.FC<ExerciseProps> = ({ exercise, onUpdateImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            onUpdateImage(exercise.name, base64String);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-background p-4 rounded-lg">
            <h4 className="font-bold text-lg text-primary">{exercise.name}</h4>
            <p className="text-text-secondary mt-1">{exercise.description}</p>
            
            <div className="mt-4">
                {exercise.imageUrl ? (
                    <img 
                        src={exercise.imageUrl} 
                        alt={`Demonstration of ${exercise.name}`}
                        className="w-full max-w-sm mx-auto rounded-lg shadow-md"
                    />
                ) : (
                    <div className="mt-4 text-center text-sm text-text-secondary bg-secondary p-4 rounded-lg flex flex-col items-center">
                        <p className="mb-3">No visual available for this exercise.</p>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={handleUploadClick}
                            className="flex items-center gap-2 bg-primary text-background font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <CameraIcon className="w-5 h-5" />
                            Upload Visual
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exercise;

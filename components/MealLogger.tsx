
import React, { useState, useRef } from 'react';
import { Meal, FoodItem } from '../types';
import { analyzeMealWithImage } from '../services/geminiService';
import Loader from './Loader';
import CameraIcon from './icons/CameraIcon';

interface MealLoggerProps {
  addMeal: (meal: Omit<Meal, 'date'>) => void;
}

const MealLogger: React.FC<MealLoggerProps> = ({ addMeal }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzedMeal, setAnalyzedMeal] = useState<Omit<Meal, 'image' | 'date'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalyzedMeal(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    setAnalyzedMeal(null);
    try {
      const base64Data = image.split(',')[1];
      const result = await analyzeMealWithImage(base64Data);
      setAnalyzedMeal(result);
    } catch (err) {
      setError('Failed to analyze meal. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMeal = () => {
    if (analyzedMeal && image) {
      addMeal({ ...analyzedMeal, image });
      setImage(null);
      setAnalyzedMeal(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Log a Meal</h2>
      <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-secondary rounded-lg p-4">
        {!image && (
          <div className="text-center">
            <CameraIcon className="mx-auto h-12 w-12 text-text-secondary" />
            <p className="mt-2 text-sm text-text-secondary">Upload a photo of your meal</p>
            <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-primary text-background font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
              Select Image
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>
        )}
        {image && (
          <div className="w-full">
            <img src={image} alt="Meal" className="max-h-60 w-auto mx-auto rounded-lg shadow-md mb-4" />
          </div>
        )}
      </div>

      {image && !analyzedMeal && !isLoading && (
        <button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full bg-primary text-background font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-500">
          Analyze Meal
        </button>
      )}

      {isLoading && <Loader message="Analyzing your meal..." />}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      
      {analyzedMeal && (
        <div className="mt-4 w-full">
          <h3 className="font-bold text-lg text-primary">Analysis Result: {analyzedMeal.totalCalories} kcal</h3>
          <ul className="mt-2 space-y-1 text-sm text-text-secondary list-disc list-inside bg-background p-3 rounded-md">
            {analyzedMeal.items.map((item, index) => (
              <li key={index}>{item.name} ({item.grams}g) - ~{item.calories} kcal</li>
            ))}
          </ul>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setImage(null)} className="flex-1 bg-secondary text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
            </button>
            <button onClick={handleLogMeal} className="flex-1 bg-primary text-background font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                Log Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealLogger;


import React, { useState, useRef } from 'react';
import { generateWorkoutPlan } from '../services/geminiService';
import Loader from './Loader';
import DumbbellIcon from './icons/DumbbellIcon';
import CameraIcon from './icons/CameraIcon';

const WorkoutPlanner: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGeneratePlan = async () => {
    if (!prompt) {
      setError("Please describe your workout goal.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setWorkoutPlan(null);
    try {
      const base64Data = image ? image.split(',')[1] : undefined;
      const mimeType = image ? image.substring(image.indexOf(':') + 1, image.indexOf(';')) : undefined;
      const result = await generateWorkoutPlan(prompt, base64Data, mimeType);
      setWorkoutPlan(result);
    } catch (err) {
      setError('Failed to generate workout plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <DumbbellIcon className="w-8 h-8 text-primary"/>
        <h2 className="text-2xl font-bold text-text-primary">Workout Planner</h2>
      </div>
      
      <div className="flex-grow flex flex-col space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A 30-minute full body workout' or 'Chest and triceps day with dumbbells and cables'"
          className="w-full flex-grow p-3 bg-background border border-secondary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-secondary resize-none"
          rows={4}
        />
        
        <div className="flex items-center justify-between gap-4">
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 text-sm bg-secondary text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
              <CameraIcon className="w-5 h-5" />
              {image ? "Change Image" : "Add Gym Photo (Optional)"}
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            {image && <button onClick={() => setImage(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
        </div>

        {image && <img src={image} alt="Gym equipment" className="max-h-32 w-auto rounded-lg self-center" />}
        
        <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-primary text-background font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-500">
          {isLoading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {isLoading && <Loader message="Creating your personalized workout..." />}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      
      {workoutPlan && (
        <div className="mt-4 w-full bg-background p-4 rounded-lg overflow-y-auto max-h-96">
          <h3 className="font-bold text-lg text-primary mb-2">Your Workout Plan</h3>
           <div 
            className="prose prose-invert text-text-secondary prose-headings:text-primary prose-strong:text-text-primary whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: workoutPlan.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;

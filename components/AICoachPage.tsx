
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Meal, ChatMessage, ActiveWorkoutPlan, WorkoutLog, WeightLogEntry, ActivityLevel } from '../types';
import { startChat } from '../services/geminiService';
import { loadChatHistory, saveChatHistory } from '../services/storageService';
import { Chat } from '@google/genai';
import Loader from './Loader';
import ChatIcon from './icons/ChatIcon';

interface AICoachPageProps {
  userProfile: UserProfile;
  meals: Meal[];
  activeWorkoutPlan: ActiveWorkoutPlan | null;
  workoutLogs: WorkoutLog[];
  weightLog: WeightLogEntry[];
}

const AICoachPage: React.FC<AICoachPageProps> = ({ userProfile, meals, activeWorkoutPlan, workoutLogs, weightLog }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getContextString = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(m => m.date === today);
    const totalCaloriesToday = todaysMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const latestWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : userProfile.weight;
    const activityLevelString = Object.entries(ActivityLevel).find(([, value]) => value === userProfile.activityLevel)?.[0].replace('_', ' ').toLowerCase();

    return `
      User Profile:
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Current Weight: ${latestWeight} kg
      - Height: ${userProfile.height} cm
      - Stated Activity Level: ${activityLevelString || 'Not set'}

      User's Nutrition Today (${today}):
      - Total Calories Consumed: ${totalCaloriesToday.toFixed(0)}
      - Meals Logged: ${todaysMeals.length > 0 ? todaysMeals.map(m => m.items.map(i => i.name).join(', ')).join('; ') : 'None logged yet.'}

      User's Active Workout Plan:
      - Plan Title: ${activeWorkoutPlan?.title || 'None selected'}

      Recent Workout History (${workoutLogs.length} total logs):
      - Last Workout: ${workoutLogs.length > 0 ? `${workoutLogs[0].planTitle} - ${workoutLogs[0].dayTitle} on ${new Date(workoutLogs[0].date).toLocaleDateString()}` : 'No workouts logged yet.'}
    `;
  };

  useEffect(() => {
    const history = loadChatHistory();
    setMessages(history);
    
    const systemInstruction = `You are "Gemini Fit," the master AI assistant for the all-in-one health app, "Gemini Fitness Pal."

Your role is to be an expert fitness coach, nutritionist, and an encouraging motivational partner. You are knowledgeable, empathetic, and proactive. Your primary goal is to help the user stay consistent and achieve their health goals.

You have access to all the user's data within the app, which is provided below. You must act AS IF you can see this data when you respond.

This data includes:
1.  **User Profile:** Age, weight, height, activity level, and primary goal (e.g., Fat Loss, Muscle Gain, Maintenance).
2.  **Daily Nutrition:** A log of all meals (from photo analysis or manual entry), total calories, and macronutrient breakdown.
3.  **Workout & Progress:** Their active workout plan, complete workout history, logged sets/reps/weights, Personal Records (PRs), and weight trend charts.

Your core capabilities are:
*   **1. Contextual Coaching:** Provide proactive, personalized advice based on the user's data.
*   **2. On-Demand Generation:** Generate workouts, recipes, and meal plans when asked.
*   **3. Analysis & Motivation:** Analyze logged meals and workouts to give feedback and encouragement. Provide predictive insights based on their consistency.
*   **4. Real-Time Form Correction (Hypothetical):** If asked to check form, (hypothetically) analyze an image/video and give specific, actionable corrections.
*   **5. App Feature Guidance:** Explain how to use app features if asked.

Your Guiding Rules:
*   **Tone:** Always be encouraging, positive, and non-judgmental. If a user misses a workout or overeats, be supportive and help them get back on track.
*   **Safety First (Crucial):** You are NOT a medical doctor. You must NEVER diagnose an injury, illness, or medical condition. If a user mentions severe pain or a health issue, your *only* response is to advise them to consult a qualified medical professional, doctor, or physical therapist.

---
CURRENT USER CONTEXT:
${getContextString()}
---

Start the initial conversation by introducing yourself as Gemini Fit and giving a brief, encouraging overview based on their current context, then ask how you can help today.`;

    const chatSession = startChat({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction,
      }
    });
    setChat(chatSession);

    if (history.length === 0) {
        // If no history, get the initial message from the model
        const fetchInitialMessage = async () => {
            setIsLoading(true);
            try {
                // The system instruction already tells the model how to start.
                // Sending a simple message triggers the initial response.
                const result = await chatSession.sendMessage({ message: "Hello, introduce yourself." });
                const modelResponse: ChatMessage = { role: 'model', parts: [{ text: result.text }] };
                setMessages([modelResponse]);
                saveChatHistory([modelResponse]);
            } catch (error) {
                console.error("Failed to fetch initial message:", error);
                const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Hello! I'm Gemini Fit, your AI coach. I'm having a little trouble getting started, but I'm here to help. What's on your mind?" }] };
                setMessages([errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInitialMessage();
    }
  }, [userProfile, meals, activeWorkoutPlan, workoutLogs, weightLog]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    saveChatHistory(messages);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: currentMessage }] };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
        let fullResponse = "";
        const stream = await chat.sendMessageStream({ message: currentMessage });
        
        // Add an empty model message placeholder
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: fullResponse }] };
                return newMessages;
            });
        }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again.' }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg h-[80vh] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <ChatIcon className="w-8 h-8 text-primary"/>
        <h2 className="text-2xl font-bold text-text-primary">AI Fitness Coach</h2>
      </div>
      <div className="flex-grow bg-background p-4 rounded-lg overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-background' : 'bg-secondary text-text-primary'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.parts[0].text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
             <div className="flex justify-start mb-4">
                <div className="max-w-md p-3 rounded-lg bg-secondary text-text-primary">
                    <Loader message="Thinking..." />
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-4">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ask your coach anything..."
          className="flex-grow p-3 bg-background border border-secondary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        <button type="submit" className="bg-primary text-background font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-500" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AICoachPage;

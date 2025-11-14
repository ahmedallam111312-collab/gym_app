
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Meal, WeightLogEntry } from '../types';
import type { Chart } from 'chart.js';

interface ProgressPageProps {
    meals: Meal[];
    dailyGoal: number;
    weightLog: WeightLogEntry[];
    onAddWeight: (entry: WeightLogEntry) => void;
}

const WeightLogForm: React.FC<{ onAddWeight: (entry: WeightLogEntry) => void; latestWeight: number }> = ({ onAddWeight, latestWeight }) => {
    const [weight, setWeight] = useState(latestWeight);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        setWeight(latestWeight);
    }, [latestWeight]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (weight > 0) {
            onAddWeight({ date, weight });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-background rounded-lg">
            <div className="flex-1 w-full">
                <label htmlFor="weight" className="text-sm font-medium text-text-secondary">Weight (kg)</label>
                <input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="mt-1 block w-full bg-secondary border-secondary rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>
             <div className="flex-1 w-full">
                <label htmlFor="date" className="text-sm font-medium text-text-secondary">Date</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full bg-secondary border-secondary rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>
            <button type="submit" className="w-full sm:w-auto mt-4 sm:mt-0 self-end bg-primary text-background font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors transform hover:scale-105">Log Weight</button>
        </form>
    )
}

const ProgressPage: React.FC<ProgressPageProps> = ({ meals, dailyGoal, weightLog, onAddWeight }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const calorieChartRef = useRef<HTMLCanvasElement>(null);
    const weightChartRef = useRef<HTMLCanvasElement>(null);
    const calorieChartInstance = useRef<Chart | null>(null);
    const weightChartInstance = useRef<Chart | null>(null);

    const dataByDate = useMemo(() => {
        const groupedData: { [key: string]: number } = {};
        meals.forEach(meal => {
            if (!groupedData[meal.date]) groupedData[meal.date] = 0;
            groupedData[meal.date] += meal.totalCalories;
        });
        return Object.entries(groupedData)
            .map(([date, totalCalories]) => ({ date, totalCalories }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [meals]);

    const mealsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return meals.filter(meal => meal.date === selectedDate);
    }, [meals, selectedDate]);

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        return adjustedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    // Calorie Chart Effect
    useEffect(() => {
        if (!calorieChartRef.current || dataByDate.length === 0) return;
        
        const ctx = calorieChartRef.current.getContext('2d');
        if (!ctx) return;

        if (calorieChartInstance.current) {
            calorieChartInstance.current.destroy();
        }

        calorieChartInstance.current = new (window as any).Chart(ctx, {
            type: 'bar',
            data: {
                labels: dataByDate.map(d => formatDateLabel(d.date)),
                datasets: [{
                    label: 'Calories Consumed',
                    data: dataByDate.map(d => d.totalCalories),
                    backgroundColor: '#00F0A0',
                    borderColor: '#00D080',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.parsed.y.toFixed(0)} kcal`
                        }
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(148, 163, 184, 0.2)' },
                        ticks: { color: '#94A3B8' }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94A3B8' }
                    }
                },
                onClick: (_, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        setSelectedDate(dataByDate[index].date);
                    }
                },
                onHover: (event, chartElement) => {
                    const canvas = event.native?.target as HTMLCanvasElement;
                    if(canvas) {
                        canvas.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    }
                }
            }
        });
        
        return () => calorieChartInstance.current?.destroy();

    }, [dataByDate]);
    
    // Weight Chart Effect
    useEffect(() => {
        if (!weightChartRef.current || weightLog.length < 2) return;
        
        const ctx = weightChartRef.current.getContext('2d');
        if (!ctx) return;

        if (weightChartInstance.current) {
            weightChartInstance.current.destroy();
        }

        weightChartInstance.current = new (window as any).Chart(ctx, {
            type: 'line',
            data: {
                labels: weightLog.map(d => formatDateLabel(d.date)),
                datasets: [{
                    label: 'Weight (kg)',
                    data: weightLog.map(d => d.weight),
                    borderColor: '#00F0A0',
                    backgroundColor: 'rgba(0, 240, 160, 0.1)',
                    tension: 0.3,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        grid: { color: 'rgba(148, 163, 184, 0.2)' },
                        ticks: { color: '#94A3B8' }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94A3B8' }
                    }
                }
            }
        });

        return () => weightChartInstance.current?.destroy();

    }, [weightLog]);


    return (
        <div className="flex flex-col gap-8">
            <div className="bg-card p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Track Your Weight</h2>
                <WeightLogForm 
                    onAddWeight={onAddWeight} 
                    latestWeight={weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : 0}
                />
                 {weightLog.length > 1 && (
                    <div className="mt-6 h-64">
                        <canvas ref={weightChartRef}></canvas>
                    </div>
                )}
            </div>

            <div className="bg-card p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Your Calorie History</h2>
                {dataByDate.length > 0 ? (
                    <div className="h-80">
                        <canvas ref={calorieChartRef}></canvas>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-text-secondary">No meals logged yet. Log meals to see your progress here!</p>
                    </div>
                )}
            </div>

            {selectedDate && mealsForSelectedDate.length > 0 && (
                 <div className="bg-card p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-text-primary mb-4">Meals for {formatDateLabel(selectedDate)}</h3>
                     <div className="flex overflow-x-auto gap-4 pb-4">
                        {mealsForSelectedDate.map((meal, index) => (
                            <div key={index} className="flex-shrink-0 w-48 bg-background rounded-lg shadow-md p-3 text-center">
                                <img src={meal.image} alt="Logged meal" className="w-full h-24 object-cover rounded-md mb-2" />
                                <p className="font-bold text-primary">{meal.totalCalories.toFixed(0)} kcal</p>
                                <p className="text-xs text-text-secondary truncate" title={meal.items.map(i => i.name).join(', ')}>
                                    {meal.items.map(i => i.name).join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </div>
    );
};

export default ProgressPage;

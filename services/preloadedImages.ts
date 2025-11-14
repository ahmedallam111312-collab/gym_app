// This file acts as a local "database" for pre-loaded exercise images.
// By storing them as base64 strings in the code, they are available immediately on first load
// without any API calls, and can be used to initialize the user's image cache.

// This is a simple placeholder SVG of a dumbbell, encoded in base64.
// You can replace this with actual, more detailed image base64 strings.
const PLACEHOLDER_DB_ICON_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0iIzk0QTNCOCI+PHJlY3QgeD0iNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgcng9IjIiLz48cmVjdCB4PSIzNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZHRoPSIyMCIgcng9IjIiLz48cmVjdCB4PSIxMCIgeT0iMjIiIHdpZHRoPSIzMCIgaGVpZHRoPSI2IiByeD0iMiIvPjwvc3ZnPg==';

export const PRELOADED_IMAGES: { [key: string]: string } = {
    // Strength Training
    'Bench Press': PLACEHOLDER_DB_ICON_BASE64,
    'Squat': PLACEHOLDER_DB_ICON_BASE64,
    'Barbell Squat': PLACEHOLDER_DB_ICON_BASE64,
    'Deadlift': PLACEHOLDER_DB_ICON_BASE64,
    'Overhead Press': PLACEHOLDER_DB_ICON_BASE64,
    'Pull-ups': PLACEHOLDER_DB_ICON_BASE64,
    'Dumbbell Rows': PLACEHOLDER_DB_ICON_BASE64,
    'Bicep Curls': PLACEHOLDER_DB_ICON_BASE64,
    'Tricep Pushdowns': PLACEHOLDER_DB_ICON_BASE64,
    'Leg Press': PLACEHOLDER_DB_ICON_BASE64,
    'Lateral Raises': PLACEHOLDER_DB_ICON_BASE64,

    // Bodyweight & Cardio
    'Push-ups': PLACEHOLDER_DB_ICON_BASE64,
    'Crunches': PLACEHOLDER_DB_ICON_BASE64,
    'Plank': PLACEHOLDER_DB_ICON_BASE64,
    'Jumping Jacks': PLACEHOLDER_DB_ICON_BASE64,
    'Burpees': PLACEHOLDER_DB_ICON_BASE64,
    'High Knees': PLACEHOLDER_DB_ICON_BASE64,
    'Mountain Climbers': PLACEHOLDER_DB_ICON_BASE64,
    'Treadmill Run': PLACEHOLDER_DB_ICON_BASE64,

    // Add more exercise names and their corresponding base64 image strings here.
};

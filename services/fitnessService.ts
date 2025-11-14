
import { UserProfile, Gender } from '../types';

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 */
const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  if (gender === Gender.MALE) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  return bmr * profile.activityLevel;
};

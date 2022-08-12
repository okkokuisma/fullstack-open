interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export const validateValues = (hours: string[] | number[], target: string | number): boolean => {
  if (!hours || !target || hours.length < 1) {
    throw new Error('Parameters missing');
  }
  if (hours.some(v => isNaN(Number(v))) || isNaN(Number(target))) {
    throw new Error('Malformatted parameters');
  }
  return true;
};

const parseArguments = (args: string[]): number[] => {
    return args.slice(2).map(a => Number(a));
};

export const exerciseCalculator = (exerciseInWeek: number[], targetHours: number): Result => {
  const dailyAverage = exerciseInWeek.reduce((prev, cur) => {
    return prev + cur;
  }, 0) / exerciseInWeek.length;

  const trainingDays = exerciseInWeek.reduce((days, hours) => {
    if (hours > 0) {
      days++;
    }
    return days;
  }, 0);

  let rating;
  let ratingDescription;
  if (dailyAverage / targetHours > 0.8) {
    rating = 3;
    ratingDescription = "Excellent work!";
  } else if (dailyAverage / targetHours > 0.5) {
    rating = 2;
    ratingDescription = "Still some work to do.";
  } else {
    rating = 1;
    ratingDescription = "You can do better!";
  }

  return {
    periodLength: exerciseInWeek.length,
    trainingDays: trainingDays,
    success: dailyAverage >= targetHours,
    rating: rating,
    ratingDescription,
    target: targetHours,
    average: dailyAverage
  };
};

try {
  const [targetHours, ...exerciseInWeek] = parseArguments(process.argv);
  validateValues(exerciseInWeek, targetHours);
  console.log(exerciseCalculator(exerciseInWeek, targetHours));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
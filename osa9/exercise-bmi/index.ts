import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { validateValues, exerciseCalculator } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: "malformatted parameters" }).end();
  } else {
    const response = {
      weight,
      height,
      bmi: calculateBmi(height, weight)
    };
    res.status(200).send(response);
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { daily_exercises, target } = req.body;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    validateValues(daily_exercises, target);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    res.send(exerciseCalculator(daily_exercises, target));
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = { error: error.message };
      res.status(400).send(errorMessage);
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
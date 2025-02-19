import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityname } = req.body;
  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherData(cityname);

  // TODO: save city to search history
  await HistoryService.saveCity(cityname);

  res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retireve weather data' });
  }

});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
try {
  const history = await HistoryService.getCities();
  res.json(history);
} catch (error) {
  res.status(500).json({ error: 'Failed to retrieve search history' });
}
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(200).json({ message: 'City deleted from history' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;

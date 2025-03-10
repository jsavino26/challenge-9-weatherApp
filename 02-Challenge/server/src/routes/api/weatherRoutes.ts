import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  console.log("Received request with body:", req.body);
  try {
    const { cityName } = req.body;

    if (!cityName) {
      console.error('City name is missing in the request body');
      return res.status(400).json({ error: 'City name is required' });
    }

    console.log('City name received:', cityName);

    // GET weather data from city name
    const data = await WeatherService.getWeatherData(cityName);
    await HistoryService.saveCity(cityName);

    return res.json(data);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data', details: (error as Error).message });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const data = await HistoryService.getCities();
    res.json(data);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

    // If removeCity throws an error or completes successfully, make sure to return a response.
    await HistoryService.removeCity(id);

    return res.status(200).json({ message: 'City deleted from history' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;

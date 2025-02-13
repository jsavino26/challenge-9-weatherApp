import { promises as fs } from 'fs';

// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  private cities: City[] = [];
  private filePath = 'searchHistory.json';
  constructor() {
    this.read();
  }

  static async saveCity(cityname: string): Promise<void> {
    const historyService = new HistoryService();
    await historyService.addCity(cityname);
  }

  // TODO: Define a read method that reads from the searchHistory.json file
private async read() {
  try {
    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    this.cities = JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }

  return this.cities;

}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
private async write(cities: City[]) {
  try {
    await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2)); 
  } catch (error) {
    console.error('Error writing file:', error);
  }
  return this.cities;
}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
async getCities() {
  return this.cities;
}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
async addCity(city: string) {
  const newCity = new City(city, Date.now().toString());
  this.cities.push(newCity);
  await this.write(this.cities);
  return this.cities;
}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
async removeCity(id: string) {
  this.cities = this.cities.filter((city) => city.id !== id);
  await this.write(this.cities);
  return this.cities;
}
}

export default new HistoryService();

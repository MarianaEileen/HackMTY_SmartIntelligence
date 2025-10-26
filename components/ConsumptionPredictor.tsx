
import React, { useState } from 'react';
import { generateConsumptionForecast } from '../services/geminiService';
import type { FlightData, ConsumptionForecast } from '../types';

const ConsumptionPredictor: React.FC = () => {
  const [flightData, setFlightData] = useState<FlightData>({
    type: 'Internacional',
    origin: 'JFK',
    destination: 'LHR',
    aircraft: 'Boeing 777',
    season: 'Verano',
    duration: 7,
    passengers: 250,
  });
  const [forecast, setForecast] = useState<ConsumptionForecast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlightData(prev => ({ ...prev, [name]: name === 'duration' || name === 'passengers' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setForecast([]);
    try {
      const result = await generateConsumptionForecast(flightData);
      setForecast(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Predicción de Consumo</h1>
        <p className="mt-1 text-slate-600">Ingrese los datos del vuelo para pronosticar el consumo de productos.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-slate-700">Origen</label>
            <input type="text" name="origin" id="origin" value={flightData.origin} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-slate-700">Destino</label>
            <input type="text" name="destination" id="destination" value={flightData.destination} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="aircraft" className="block text-sm font-medium text-slate-700">Aeronave</label>
            <input type="text" name="aircraft" id="aircraft" value={flightData.aircraft} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="season" className="block text-sm font-medium text-slate-700">Temporada</label>
            <select name="season" id="season" value={flightData.season} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option>Primavera</option>
              <option>Verano</option>
              <option>Otoño</option>
              <option>Invierno</option>
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700">Duración (horas)</label>
            <input type="number" name="duration" id="duration" value={flightData.duration} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-slate-700">Nº Pasajeros</label>
            <input type="number" name="passengers" id="passengers" value={flightData.passengers} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
              {isLoading ? 'Generando...' : 'Generar Pronóstico'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}

      {(isLoading || forecast.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Resultados del Pronóstico</h2>
          {isLoading ? (
             <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
          ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Producto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Consumo Previsto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Unidad</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {forecast.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.predictedConsumption}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.unit}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsumptionPredictor;

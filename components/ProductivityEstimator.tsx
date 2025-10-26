
import React, { useState } from 'react';
import { generateProductivityEstimate } from '../services/geminiService';
import type { ProductivityEstimate } from '../types';

const ProductivityEstimator: React.FC = () => {
  const [products, setProducts] = useState('10x Bebidas gaseosas (330ml)\n15x Sandwiches de jamón y queso\n10x Ensaladas de pollo\n20x Paquetes de galletas\n5x Botellas de vino tinto (187ml)');
  const [estimate, setEstimate] = useState<ProductivityEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEstimate(null);
    try {
      const result = await generateProductivityEstimate(products);
      setEstimate(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Estimación de Productividad</h1>
        <p className="mt-1 text-slate-600">Ingrese los productos requeridos para estimar el tiempo de armado del trolley.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="products" className="block text-sm font-medium text-slate-700">Lista de Productos y Cantidades</label>
            <textarea
              id="products"
              name="products"
              rows={6}
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
              placeholder="Ej: 10x Bebida Gaseosa..."
            />
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
              {isLoading ? 'Estimando...' : 'Estimar Tiempo de Armado'}
            </button>
          </div>
        </form>
      </div>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}

      {isLoading && (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-slate-600">Analizando con modelo LightGBM...</p>
        </div>
      )}

      {estimate && !isLoading && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Resultados de la Estimación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Tiempo Estimado</p>
                <p className="text-4xl font-bold text-blue-600">{estimate.estimatedTimeMinutes.toFixed(1)}</p>
                <p className="text-sm text-blue-800">minutos</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-800 font-medium">Nivel de Confianza</p>
                <p className="text-4xl font-bold text-slate-600">{(estimate.confidenceScore * 100).toFixed(0)}%</p>
                 <p className="text-sm text-slate-800">de precisión</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-700">Factores Considerados</h3>
            <ul className="mt-2 list-disc list-inside space-y-1 text-slate-600">
              {estimate.factors.map((factor, index) => <li key={index}>{factor}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityEstimator;


import React, { useState, useRef } from 'react';
import { ProductStatus } from '../types';
import type { ScannedProduct } from '../types';
import { CheckCircleIcon, WarningIcon, ErrorIcon } from './icons/StatusIcons';

// Mock database of products that a QR code could represent
const MOCK_PRODUCTS = [
  { id: 'PROD-101', name: 'Jugo de Naranja (1L)', daysUntilExpiry: 15 },
  { id: 'PROD-205', name: 'Sandwich de Pavo', daysUntilExpiry: 4 },
  { id: 'PROD-310', name: 'Yogurt de Fresa', daysUntilExpiry: -2 },
  { id: 'PROD-415', name: 'Galletas Saladas', daysUntilExpiry: 60 },
  { id: 'PROD-522', name: 'Agua Mineral (500ml)', daysUntilExpiry: 180 },
  { id: 'PROD-630', name: 'Ensalada César', daysUntilExpiry: 1 },
];

const ExpirationScanner: React.FC = () => {
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getProductStatus = (expirationDate: Date): ProductStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    const expiry = new Date(expirationDate);
    expiry.setHours(0, 0, 0, 0); // Normalize expiration date

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return ProductStatus.Expired;
    }
    if (diffDays <= 5) {
      return ProductStatus.Warning;
    }
    return ProductStatus.Ok;
  };

  const simulateScan = () => {
    setIsScanning(true);
    // Simulate network delay and processing
    setTimeout(() => {
      // Pick a random product from our mock database
      const randomProductData = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + randomProductData.daysUntilExpiry);

      const status = getProductStatus(expirationDate);
      
      setScannedProduct({
        ...randomProductData,
        expirationDate,
        status,
      });
      setIsScanning(false);
    }, 1500);
  };
  
  const handleScanClick = () => {
      // We don't need to actually open the file picker to simulate this.
      // If we wanted real functionality, we'd use `fileInputRef.current?.click();`
      // For this app, clicking the button directly triggers the simulation.
      setScannedProduct(null);
      simulateScan();
  };

  const getStatusInfo = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.Ok:
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-400',
          icon: <CheckCircleIcon />,
          title: 'Producto en buen estado',
        };
      case ProductStatus.Warning:
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-400',
          icon: <WarningIcon />,
          title: 'Próximo a caducar',
        };
      case ProductStatus.Expired:
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-400',
          icon: <ErrorIcon />,
          title: 'Producto caducado',
        };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Datos de Caducidad</h1>
        <p className="mt-1 text-slate-600">Escanee el código QR de un producto para verificar su estado de caducidad.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Simulador de Escáner QR</h2>
        <button
          onClick={handleScanClick}
          disabled={isScanning}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
        >
          {isScanning ? 'Escaneando...' : 'Escanear Producto'}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
      </div>

      {isScanning && (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-slate-600">Procesando código QR...</p>
        </div>
      )}

      {scannedProduct && !isScanning && (
        <div className={`p-6 rounded-lg shadow-md border ${getStatusInfo(scannedProduct.status).borderColor} ${getStatusInfo(scannedProduct.status).bgColor}`}>
          <div className="flex items-start">
            <div className={`mr-4 ${getStatusInfo(scannedProduct.status).textColor}`}>
              {getStatusInfo(scannedProduct.status).icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${getStatusInfo(scannedProduct.status).textColor}`}>
                {getStatusInfo(scannedProduct.status).title}
              </h3>
              <div className="mt-4 space-y-2 text-slate-700">
                <p><span className="font-semibold">ID Producto:</span> {scannedProduct.id}</p>
                <p><span className="font-semibold">Nombre:</span> {scannedProduct.name}</p>
                <p><span className="font-semibold">Fecha de Caducidad:</span> {scannedProduct.expirationDate.toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpirationScanner;

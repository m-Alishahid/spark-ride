import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { service, vehicleTypes, extraServices, additionalServices, calculatePrice } from '@/utils/services';

const OrderSummaryAccordion = ({ formData, totalPrice, discountedPrice, isPromoValid }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="border border-gray-600 rounded-lg bg-gray-800/50">
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center p-4 text-left text-white hover:bg-gray-700/50 transition-colors duration-200"
      >
        <span className="font-semibold">Order Summary</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2">
          {/* Vehicles */}
          {formData.vehicles.map((vehicle, index) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between text-gray-300">
                <span>{vehicle.make} {vehicle.model} {vehicle.year}</span>
                <span>${vehicle.selectedPackages.reduce((sum, pkgId) => {
                  if (Object.keys(extraServices.ceramiccoating).includes(pkgId)) {
                    return sum + extraServices.ceramiccoating[pkgId]?.price || 0;
                  } else if (Object.keys(extraServices.windowtinting).includes(pkgId)) {
                    return sum + extraServices.windowtinting[pkgId]?.price || 0;
                  } else {
                    const serviceCategory = pkgId.split("-")[0];
                    return sum + calculatePrice(vehicle.vehicleType, pkgId, serviceCategory, Number(vehicle.size));
                  }
                }, 0).toFixed(2)}</span>
              </div>
              {vehicle.selectedPackages.map((pkgId) => {
                let pkgName = '';
                if (Object.keys(extraServices.ceramiccoating).includes(pkgId)) {
                  pkgName = extraServices.ceramiccoating[pkgId]?.name;
                } else if (Object.keys(extraServices.windowtinting).includes(pkgId)) {
                  pkgName = extraServices.windowtinting[pkgId]?.name;
                } else {
                  const serviceCategory = pkgId.split("-")[0];
                  const packages = service[vehicle.vehicleType]?.[serviceCategory];
                  pkgName = packages?.[pkgId.split("-")[1]]?.name;
                }
                return (
                  <div key={pkgId} className="flex justify-between text-gray-400 ml-4">
                    <span>• {pkgName}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Additional Services */}
          {formData.additionalServices.map((serviceId) => {
            const service = additionalServices.find(s => s.id === serviceId);
            return (
              <div key={serviceId} className="flex justify-between text-sm text-gray-300">
                <span>{service?.name}</span>
                <span>${service?.price}</span>
              </div>
            );
          })}

          {/* Subtotal */}
          <div className="flex justify-between text-sm text-gray-300 border-t border-gray-600 pt-2">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          {/* Promo Discount */}
          {isPromoValid && (
            <div className="flex justify-between text-sm text-green-400">
              <span>Promo Discount (15%)</span>
              <span>-${(totalPrice - discountedPrice).toFixed(2)}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between text-lg font-bold text-white border-t border-gray-600 pt-2">
            <span>Total</span>
            <span>${discountedPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryAccordion;

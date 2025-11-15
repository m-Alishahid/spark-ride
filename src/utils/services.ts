// ---------------- Vehicle Service Packages ----------------
export type ServicePackage = {
  name: string;
  price?: number;
  pricePerFt?: number;
  includes: string[];
};

// Import data from existing files
import { mainServices, serviceTypes, timeSlots } from '@/data/booking-service';
import { allCities } from '@/data/stateMapping';

// Export main services with enhanced data
export const service = serviceTypes;
export const vehicleTypes = ['sedan', 'suv', 'truck', 'van', 'bike', 'boat', 'jetski', 'rv'];
export const additionalServices = [
  { id: "odor_removal", name: "Odor Removal", price: 50 },
  { id: "pet_hair", name: "Pet Hair Removal", price: 40 },
  { id: "engine_cleaning", name: "Engine Cleaning", price: 70 },
  { id: "headlight_restore", name: "Headlight Restoration", price: 60 }
];
export { timeSlots };
export { allCities };

// Enhanced main services with process steps and duration
export const enhancedMainServices = mainServices.map(service => ({
  ...service,
  duration: service.id === 'ceramic-coating' ? '4-6 hours' :
           service.id === 'window-tinting' ? '2-4 hours' :
           service.id === 'paint-correction' ? '6-8 hours' :
           service.id === 'mobile-detailing' ? '1-2 hours' :
           service.id === 'interior-detailing' ? '3-5 hours' :
           service.id === 'exterior-detailing' ? '2-3 hours' :
           service.id === 'headlight-restoration' ? '1-2 hours' :
           service.id === 'engine-detailing' ? '2-3 hours' : 'Varies',
  process: service.id === 'ceramic-coating' ? [
    'Vehicle inspection and preparation',
    'Multi-stage paint correction',
    'Surface decontamination',
    'Ceramic coating application',
    'Curing and final inspection'
  ] : service.id === 'window-tinting' ? [
    'Window measurement and film selection',
    'Surface cleaning and preparation',
    'Film application with precision tools',
    'Heat shrinking and edge finishing',
    'Quality inspection and warranty'
  ] : service.id === 'paint-correction' ? [
    'Paint depth assessment',
    'Clay bar treatment',
    'Multi-stage compounding',
    'Polishing and refinement',
    'Protection application'
  ] : service.id === 'mobile-detailing' ? [
    'On-site vehicle assessment',
    'Mobile equipment setup',
    'Comprehensive cleaning',
    'Protection application',
    'Final quality check'
  ] : service.id === 'interior-detailing' ? [
    'Interior inspection',
    'Deep vacuuming and extraction',
    'Surface cleaning and conditioning',
    'Odor elimination',
    'Protection application'
  ] : service.id === 'exterior-detailing' ? [
    'Vehicle wash and decontamination',
    'Clay bar treatment',
    'Polishing and waxing',
    'Wheel and tire cleaning',
    'Final detailing'
  ] : service.id === 'headlight-restoration' ? [
    'Headlight inspection',
    'Sanding and polishing',
    'UV protection application',
    'Clarity restoration'
  ] : service.id === 'engine-detailing' ? [
    'Engine bay cleaning',
    'Degreasing and steam cleaning',
    'Protective coating',
    'Final dressing'
  ] : []
}));

// Calculate price function
export const calculatePrice = (
  vehicleType: string,
  packageId: string,
  serviceCategory: string,
  vehicleSize?: number
): number => {
  const vehicleData = service.find(s => s.id === 'car-detailing')?.variants.find(v => v.id === vehicleType);
  if (!vehicleData) return 0;

  const pkg = vehicleData.packages.find(p => p.id === packageId);
  if (!pkg) return 0;

  if (pkg.pricingType === 'perFoot' && vehicleSize) {
    return pkg.pricePerFt ? pkg.pricePerFt * vehicleSize : 0;
  }

  return pkg.price || 0;
};

export const extraServices = {
  ceramiccoating: {
    '1year': { name: '1 Year Ceramic Coating', price: 500 },
    '5year': { name: '5 Year Ceramic Coating', price: 1200 },
    '10year': { name: '10 Year Ceramic Coating', price: 2000 },
  },
  windowtinting: {
    standard: { name: 'Standard Window Tint', price: 300 },
    ceramic: { name: 'Ceramic Window Tint', price: 500 },
  },
};


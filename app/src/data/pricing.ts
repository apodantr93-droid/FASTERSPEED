import type { ServiceType } from '@/types';

export interface CalculatorResult {
  basePrice: number;
  weightPrice: number;
  serviceFee: number;
  total: number;
}

const governorateBasePrices: Record<string, number> = {
  'القاهرة': 25,
  'الجيزة': 25,
  'القليوبية': 30,
  'الإسكندرية': 40,
  'الشرقية': 35,
  'الدقهلية': 35,
  'البحيرة': 40,
  'المنوفية': 35,
  'الغربية': 35,
  'سوهاج': 50,
  'أسيوط': 50,
  'المنيا': 45,
  'قنا': 55,
  'الأقصر': 60,
  'أسوان': 65,
  'كفر الشيخ': 45,
  'دمياط': 40,
  'بورسعيد': 45,
  'الإسماعيلية': 45,
  'السويس': 40,
  'شمال سيناء': 55,
  'جنوب سيناء': 65,
  'البحر الأحمر': 65,
  'الوادي الجديد': 60,
  'مطروح': 55,
  'الفيوم': 40,
  'بني سويف': 40,
};

export const allGovernorates = Object.keys(governorateBasePrices).sort();

const SERVICE_MULTIPLIERS: Record<ServiceType, number> = {
  normal: 1,
  express: 1.5,
  cold: 2,
};

const PER_KG_PRICE = 5;

export function calculateShippingPrice(
  fromGovernorate: string,
  toGovernorate: string,
  weight: number,
  serviceType: ServiceType = 'normal'
): CalculatorResult {
  const basePrice = governorateBasePrices[toGovernorate] || governorateBasePrices[fromGovernorate] || 30;
  const weightPrice = weight > 1 ? Math.ceil(weight - 1) * PER_KG_PRICE : 0;
  const multiplier = SERVICE_MULTIPLIERS[serviceType];
  const subtotal = (basePrice + weightPrice) * multiplier;
  const serviceFee = subtotal - basePrice - weightPrice;

  return {
    basePrice: Math.round(basePrice),
    weightPrice: Math.round(weightPrice),
    serviceFee: Math.round(serviceFee),
    total: Math.round(subtotal),
  };
}

export function getBasePrice(governorate: string): number {
  return governorateBasePrices[governorate] || 30;
}

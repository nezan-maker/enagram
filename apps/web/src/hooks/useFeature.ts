import { useAuthStore } from '../store/auth.store';
import { TierPolicy, Feature } from '../policies/feature.policy';

export const useFeature = (feature: Feature): boolean => {
  const restaurantTier = useAuthStore((state) => state.restaurantTier);
  
  if (!restaurantTier) return false;
  
  return TierPolicy[feature].includes(restaurantTier);
};

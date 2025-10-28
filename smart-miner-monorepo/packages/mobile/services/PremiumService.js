import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_STATUS_KEY = 'premium_status';

class PremiumService {
  async isPremium() {
    try {
      const status = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
      return status === 'true';
    } catch (error) {
      console.error('Error getting premium status:', error);
      return false;
    }
  }

  async unlockPremium() {
    try {
      await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true');
      console.log('Premium status unlocked');
    } catch (error) {
      console.error('Error unlocking premium status:', error);
    }
  }

  async lockPremium() {
    try {
      await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'false');
      console.log('Premium status locked');
    } catch (error) {
      console.error('Error locking premium status:', error);
    }
  }
}

export default new PremiumService();

import AsyncStorage from '@react-native-async-storage/async-storage';
import PremiumService from './PremiumService';

const DEV_ADDRESSES = {
  USDT: 'TXdzYBoq2xpvpQWkve3WK4ENrPC6V2KuHY',
  ETH: '0xcec487423a408d0bfb7e1ea7fe96098348e563e0',
  BTC: '1BB8HSSRnJReEAfAPuXhmn8VxFB38pFV1a',
};

class ReferralService {
  constructor() {
    this.referralCode = null;
    this.referrer = null;
    this.referralTree = {};
  }

  async init() {
    this.referralCode = await this.getOrCreateReferralCode();
    this.referrer = await this.getReferrer();
    this.referralTree = await this.getReferralTree();
  }

  async getOrCreateReferralCode() {
    let code = await AsyncStorage.getItem('referralCode');
    if (!code) {
      code = this.generateReferralCode();
      await AsyncStorage.setItem('referralCode', code);
    }
    return code;
  }

  generateReferralCode() {
    return 'REF' + Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  async setReferrer(code) {
    this.referrer = code;
    await AsyncStorage.setItem('referrer', code);
  }

  async getReferrer() {
    return await AsyncStorage.getItem('referrer');
  }

  async addReferral(code) {
    const tree = await this.getReferralTree();
    tree[code] = {};
    await AsyncStorage.setItem('referralTree', JSON.stringify(tree));
    this.referralTree = tree;
  }

  async getReferralTree() {
    const tree = await AsyncStorage.getItem('referralTree');
    return tree ? JSON.parse(tree) : {};
  }

  async calculateEarnings(miningEarnings) {
    const isPremium = await PremiumService.isPremium();
    const devCommission = miningEarnings * 0.03;
    let userEarnings = miningEarnings - devCommission;
    const referralEarnings = {
      tier1: 0,
      tier2: 0,
      tier3: 0,
    };

    // This is a simplified simulation. A real implementation would
    // require a backend to track the entire referral network.
    if (this.referrer) {
      let tier1Rate = 0.05;
      if (isPremium) {
        tier1Rate += 0.01;
      }
      referralEarnings.tier1 = miningEarnings * tier1Rate;
      userEarnings -= referralEarnings.tier1;
    }

    return {
      userEarnings,
      devCommission,
      referralEarnings,
    };
  }
}

export default new ReferralService();

import { NativeModules, NativeEventEmitter } from 'react-native';
import DeviceHealthService from './DeviceHealthService';
import DatabaseService from './DatabaseService';
import ReferralService from './ReferralService';

const { MiningModule } = NativeModules;
const miningModuleEmitter = new NativeEventEmitter(MiningModule);

class MiningService {
  constructor() {
    this.subscribers = [];
    this.miningInterval = null;
    this.hashrate = 0;
    this.earnings = 0;
    this.isPaused = false;
    this.startTime = null;
    this.miningMode = 'cpu'; // 'cpu' or 'gpu'

    DeviceHealthService.subscribe(({ isSafeToMine }) => {
      if (!isSafeToMine) {
        if (!this.isPaused) {
          this.pause();
        }
      } else {
        if (this.isPaused) {
          this.resume();
        }
      }
    });

    miningModuleEmitter.addListener('onNewHash', async (hash) => {
      const miningEarnings = 0.001; // Simulate earnings for each hash
      const { userEarnings } = await ReferralService.calculateEarnings(miningEarnings);

      if (this.miningMode === 'gpu') {
        this.earnings += userEarnings;
        this.notifySubscribers();
      }
    });
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      callback({
        hashrate: this.hashrate,
        earnings: this.earnings,
      });
    });
  }

  start(job) {
    if (this.miningInterval) {
      return;
    }
    this.miningMode = 'cpu';
    this.startTime = new Date().toISOString();
    MiningModule.startMining(job);
    this.miningInterval = setInterval(() => {
      // CPU mining stats are handled by the existing logic
    }, 2000);
  }

  startGpuMining(job) {
    if (this.miningInterval) {
      return;
    }
    this.miningMode = 'gpu';
    this.startTime = new Date().toISOString();
    MiningModule.startGpuMining(job);
    this.miningInterval = setInterval(async () => {
      if (!this.isPaused) {
        const stats = await MiningModule.getGpuMinerStats();
        const parsedStats = JSON.parse(stats);
        this.hashrate = parsedStats.hashrate;
      } else {
        this.hashrate = 0;
      }
      this.notifySubscribers();
    }, 2000);
  }

  stop() {
    if (this.miningInterval) {
      clearInterval(this.miningInterval);
      this.miningInterval = null;
      if (this.miningMode === 'gpu') {
        MiningModule.stopGpuMining();
      }

      const session = {
        startTime: this.startTime,
        endTime: new Date().toISOString(),
        hashrate: this.hashrate,
        earnings: this.earnings,
      };
      DatabaseService.logSession(session);

      this.hashrate = 0;
      this.earnings = 0;
      this.startTime = null;
      this.notifySubscribers();
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }
}

export default new MiningService();

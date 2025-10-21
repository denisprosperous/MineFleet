import DeviceHealthService from './DeviceHealthService';
import DatabaseService from './DatabaseService';

class MiningService {
  constructor() {
    this.subscribers = [];
    this.miningInterval = null;
    this.hashrate = 0;
    this.earnings = 0;
    this.isPaused = false;
    this.startTime = null;

    DeviceHealthService.subscribe(({ batteryLevel, temperature }) => {
      if (batteryLevel < 0.2 || temperature > 50) {
        if (!this.isPaused) {
          this.pause();
        }
      } else {
        if (this.isPaused) {
          this.resume();
        }
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

  start() {
    if (this.miningInterval) {
      return;
    }

    this.startTime = new Date().toISOString();
    this.miningInterval = setInterval(() => {
      if (!this.isPaused) {
        // Simulate hashrate fluctuations
        this.hashrate = Math.random() * (1.5 - 1.0) + 1.0; // MH/s
        // Simulate earnings based on hashrate
        this.earnings += this.hashrate * 0.00001;
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

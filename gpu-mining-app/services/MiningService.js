// This is a simulated mining service. In a real application, this would
// interface with the native mining layer.

class MiningService {
  constructor() {
    this.subscribers = [];
    this.miningInterval = null;
    this.hashrate = 0;
    this.earnings = 0;
    this.temperature = 30;
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
        temperature: this.temperature,
      });
    });
  }

  start() {
    if (this.miningInterval) {
      return;
    }

    this.miningInterval = setInterval(() => {
      // Simulate hashrate fluctuations
      this.hashrate = Math.random() * (1.5 - 1.0) + 1.0; // MH/s
      // Simulate earnings based on hashrate
      this.earnings += this.hashrate * 0.00001;
      // Simulate temperature changes
      this.temperature = Math.random() * (45 - 40) + 40; // degrees Celsius

      this.notifySubscribers();
    }, 2000);
  }

  stop() {
    if (this.miningInterval) {
      clearInterval(this.miningInterval);
      this.miningInterval = null;
      this.hashrate = 0;
      this.temperature = 30;
      this.notifySubscribers();
    }
  }
}

export default new MiningService();

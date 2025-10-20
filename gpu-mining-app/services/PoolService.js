// This is a simulated pool service. In a real application, this would
// handle the Stratum protocol and the WebSocket connection to the pool.

const POOLS = [
  {
    id: 'monero-ocean',
    name: 'Monero Ocean',
    url: 'gulf.moneroocean.stream:10128',
    fee: 0.9,
  },
  {
    id: '2miners',
    name: '2Miners',
    url: 'xmr.2miners.com:2222',
    fee: 1,
  },
  {
    id: 'nanopool',
    name: 'Nanopool',
    url: 'xmr-us-east1.nanopool.org:14444',
    fee: 1,
  },
];

class PoolService {
  constructor() {
    this.selectedPool = POOLS[0];
    this.subscribers = [];
    this.connectionInterval = null;
    this.status = 'Disconnected';
  }

  getPools() {
    return POOLS;
  }

  setSelectedPool(pool) {
    this.selectedPool = pool;
    this.disconnect();
    this.connect();
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
        status: this.status,
      });
    });
  }

  connect() {
    if (this.connectionInterval) {
      return;
    }

    this.status = 'Connecting...';
    this.notifySubscribers();

    this.connectionInterval = setTimeout(() => {
      this.status = 'Connected';
      this.notifySubscribers();
    }, 2000);
  }

  disconnect() {
    if (this.connectionInterval) {
      clearTimeout(this.connectionInterval);
      this.connectionInterval = null;
    }
    this.status = 'Disconnected';
    this.notifySubscribers();
  }
}

export default new PoolService();

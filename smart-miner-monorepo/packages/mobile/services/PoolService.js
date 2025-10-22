import WebSocket from 'ws';

const POOLS = [
  { id: 'monero-ocean', name: 'Monero Ocean', url: 'wss://gulf.moneroocean.stream/ws', fee: 0.9 },
  // Add other pools with WebSocket URLs
];

class PoolService {
  constructor() {
    this.selectedPool = POOLS[0];
    this.subscribers = {
        status: [],
        job: [],
    };
    this.ws = null;
    this.status = 'Disconnected';
    this.job = null;
    this.messageId = 1;
  }

  getPools() {
    return POOLS;
  }

  setSelectedPool(pool) {
    this.selectedPool = pool;
    this.disconnect();
    this.connect();
  }

  subscribe(event, callback) {
    if (this.subscribers[event]) {
        this.subscribers[event].push(callback);
    }
    return () => {
        if (this.subscribers[event]) {
            this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
        }
    };
  }

  notify(event, data) {
    if (this.subscribers[event]) {
        this.subscribers[event].forEach(callback => callback(data));
    }
  }

  connect(walletAddress) {
    if (this.ws) {
      return;
    }

    this.status = 'Connecting...';
    this.notify('status', { status: this.status });

    this.ws = new WebSocket(this.selectedPool.url);

    this.ws.on('open', () => {
      this.status = 'Authenticating...';
      this.notify('status', { status: this.status });
      const loginMessage = {
        "jsonrpc": "2.0",
        "id": this.messageId++,
        "method": "login",
        "params": {
          "login": walletAddress,
          "pass": "x",
          "agent": "GPU-Mining-App"
        }
      };
      this.ws.send(JSON.stringify(loginMessage));
    });

    this.ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.id === 1 && message.result) {
            this.status = 'Connected';
            this.notify('status', { status: this.status });
            this.job = message.result.job;
            this.notify('job', { job: this.job });
        } else if (message.method === 'job') {
            this.job = message.params;
            this.notify('job', { job: this.job });
        }
    });

    this.ws.on('error', (error) => {
        console.error("WebSocket Error:", error);
        this.status = 'Error';
        this.notify('status', { status: this.status });
        this.disconnect();
    });

    this.ws.on('close', () => {
        this.status = 'Disconnected';
        this.notify('status', { status: this.status });
        this.ws = null;
    });
  }

  submit(hash) {
    if (!this.ws || !this.job) {
        return;
    }
    const submission = {
        "jsonrpc": "2.0",
        "id": this.messageId++,
        "method": "submit",
        "params": {
            "id": this.job.id,
            "job_id": this.job.job_id,
            "nonce": "00000000", // Nonce needs to be found by the miner
            "result": hash
        }
    };
    this.ws.send(JSON.stringify(submission));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new PoolService();

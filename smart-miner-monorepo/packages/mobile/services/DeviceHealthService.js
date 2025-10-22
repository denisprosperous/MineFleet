import * as Battery from 'expo-battery';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

class DeviceHealthService {
  constructor() {
    this.subscribers = [];
    this.batteryLevel = 1;
    this.isCharging = false;
    this.temperature = 30;
    this.isConnected = true;
    this.connectionType = null;
    this.isScreenOn = true;
    this.mineOnMobileData = false;
    this.monitoringInterval = null;

    this.init();
  }

  async init() {
    this.batteryLevel = await Battery.getBatteryLevelAsync();
    const batteryState = await Battery.getBatteryStateAsync();
    this.isCharging = batteryState === Battery.BatteryState.CHARGING;

    Battery.addBatteryLevelListener(({ batteryLevel }) => {
      this.batteryLevel = batteryLevel;
      this.notifySubscribers();
    });

    Battery.addBatteryStateChangeListener(({ batteryState }) => {
      this.isCharging = batteryState === Battery.BatteryState.CHARGING;
      this.notifySubscribers();
    });

    NetInfo.addEventListener(state => {
      this.isConnected = state.isConnected;
      this.connectionType = state.type;
      this.notifySubscribers();
    });

    AppState.addEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    this.isScreenOn = nextAppState === 'active';
    this.notifySubscribers();
  }

  setMineOnMobileData(value) {
    this.mineOnMobileData = value;
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers() {
    const isSafeToMine =
      this.temperature < 43 &&
      this.batteryLevel > 0.3 &&
      (this.connectionType === 'wifi' || this.mineOnMobileData) &&
      !this.isScreenOn;

    this.subscribers.forEach(callback => {
      callback({
        batteryLevel: this.batteryLevel,
        isCharging: this.isCharging,
        temperature: this.temperature,
        isConnected: this.isConnected,
        connectionType: this.connectionType,
        isScreenOn: this.isScreenOn,
        isSafeToMine,
      });
    });
  }

  startMonitoring() {
    if (this.monitoringInterval) {
      return;
    }
    this.monitoringInterval = setInterval(() => {
      // Simulate temperature changes during mining
      if (this.isCharging) {
        this.temperature = Math.random() * (50 - 45) + 45; // Higher temp when charging
      } else {
        this.temperature = Math.random() * (45 - 40) + 40;
      }
      this.notifySubscribers();
    }, 2000);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      this.temperature = 30; // Reset to a safe temperature
      this.notifySubscribers();
    }
  }
}

export default new DeviceHealthService();

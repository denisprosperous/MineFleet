import { requireNativeModule, EventEmitter } from 'expo-modules-core';

const MiningModule = requireNativeModule('MiningModule');
const emitter = new EventEmitter(MiningModule);

export function startMining(job: string) {
  MiningModule.startMining(job);
}

export function addHashListener(listener: (hash: string) => void) {
  return emitter.addListener('onNewHash', listener);
}

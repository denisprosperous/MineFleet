import { requireNativeModule } from 'expo-modules-core';

const MiningModule = requireNativeModule('MiningModule');

export function startMining(job: string): string {
  return MiningModule.startMining(job);
}

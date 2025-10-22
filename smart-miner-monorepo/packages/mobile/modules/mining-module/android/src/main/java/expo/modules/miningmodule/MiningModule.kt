package expo.modules.miningmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MiningModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MiningModule")

    Events("onNewHash")

    Function("startMining") { job: String ->
      nativeStartMining(this, job)
    }

    Function("startGpuMining") { job: String ->
      nativeStartGpuMining(this, job)
    }

    Function("stopGpuMining") {
      nativeStopGpuMining()
    }

    Function("getGpuMinerStats") {
      return@Function nativeGetGpuMinerStats()
    }
  }

  private external fun nativeStartMining(module: MiningModule, job: String)
  private external fun nativeStartGpuMining(module: MiningModule, job: String)
  private external fun nativeStopGpuMining()
  private external fun nativeGetGpuMinerStats(): String

  companion object {
    init {
      System.loadLibrary("MiningModule")
    }
  }
}

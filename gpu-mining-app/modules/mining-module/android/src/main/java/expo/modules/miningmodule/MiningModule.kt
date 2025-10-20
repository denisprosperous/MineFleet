package expo.modules.miningmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MiningModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MiningModule")

    Function("startMining") { job: String ->
      return@Function nativeStartMining(job)
    }
  }

  private external fun nativeStartMining(job: String): String

  companion object {
    init {
      System.loadLibrary("MiningModule")
    }
  }
}

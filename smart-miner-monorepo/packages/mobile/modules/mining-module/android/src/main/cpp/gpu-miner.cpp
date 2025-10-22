#include <jni.h>
#include <string>
#include <thread>
#include <atomic>
#include <chrono>

// Simulation variables
std::atomic<bool> isGpuMining(false);
std::atomic<int> gpuHashrate(0);
std::atomic<int> acceptedShares(0);
std::thread gpuMiningThread;

// JNI environment for callbacks
JavaVM* jvm = nullptr;
jobject moduleObject = nullptr;

void gpuMiningLoop() {
    JNIEnv* env;
    jvm->AttachCurrentThread(&env, NULL);

    jclass moduleClass = env->GetObjectClass(moduleObject);
    jmethodID onNewHashMethod = env->GetMethodID(moduleClass, "onNewHash", "(Ljava/lang/String;)V");

    while (isGpuMining) {
        // Simulate hashing
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        gpuHashrate = 12345; // Simulated hashrate in KH/s
        acceptedShares++;

        // Send a simulated hash back to the JS layer
        std::string hash = "0x" + std::to_string(rand());
        jstring hashStr = env->NewStringUTF(hash.c_str());
        env->CallVoidMethod(moduleObject, onNewHashMethod, hashStr);
        env->DeleteLocalRef(hashStr);
    }

    jvm->DetachCurrentThread();
}

extern "C" JNIEXPORT void JNICALL
Java_expo_modules_miningmodule_MiningModule_nativeStartGpuMining(JNIEnv *env, jobject /* this */, jobject module, jstring job) {
    if (!isGpuMining) {
        isGpuMining = true;
        env->GetJavaVM(&jvm);
        moduleObject = env->NewGlobalRef(module);
        gpuMiningThread = std::thread(gpuMiningLoop);
    }
}

extern "C" JNIEXPORT void JNICALL
Java_expo_modules_miningmodule_MiningModule_nativeStopGpuMining(JNIEnv *env, jobject /* this */) {
    if (isGpuMining) {
        isGpuMining = false;
        if (gpuMiningThread.joinable()) {
            gpuMiningThread.join();
        }
        if (moduleObject != nullptr) {
            env->DeleteGlobalRef(moduleObject);
            moduleObject = nullptr;
        }
    }
}

extern "C" JNIEXPORT jstring JNICALL
Java_expo_modules_miningmodule_MiningModule_nativeGetGpuMinerStats(JNIEnv *env, jobject /* this */) {
    std::string stats = "{\"hashrate\": " + std::to_string(gpuHashrate) + ", \"acceptedShares\": " + std::to_string(acceptedShares) + "}";
    return env->NewStringUTF(stats.c_c_str());
}

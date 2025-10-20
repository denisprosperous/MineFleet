#include <jni.h>
#include <string>
#include <thread>
#include <chrono>

extern "C" JNIEXPORT jstring JNICALL
Java_expo_modules_miningmodule_MiningModule_nativeStartMining(JNIEnv *env, jobject /* this */, jstring job) {
    const char *nativeJob = env->GetStringUTFChars(job, 0);

    // Simulate mining work
    std::this_thread::sleep_for(std::chrono::seconds(2));

    std::string hash = "0x1234567890abcdef";

    env->ReleaseStringUTFChars(job, nativeJob);

    return env->NewStringUTF(hash.c_str());
}

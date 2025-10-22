#include <jni.h>
#include <string>
#include <thread>
#include <chrono>
#include "modernRX/modernRX.h"

// JNI Globals for event emitting
static JavaVM* jvm = nullptr;
static jclass miningModuleClass = nullptr;
static jobject miningModuleObject = nullptr;
static jmethodID onNewHashMethod = nullptr;

void emitNewHash(const char* hash) {
    JNIEnv *env;
    jvm->AttachCurrentThread(&env, NULL);
    jstring jhash = env->NewStringUTF(hash);
    env->CallVoidMethod(miningModuleObject, onNewHashMethod, jhash);
    jvm->DetachCurrentThread();
}

void mining_thread(std::string job) {
    auto machine = modernRX::Machine(RandomX_FlagsJIT);
    char hash[32];

    while (true) {
        machine.hash(job.c_str(), job.length(), hash);

        char hexHash[65];
        for (int i = 0; i < 32; ++i) {
            sprintf(&hexHash[i * 2], "%02x", (unsigned char)hash[i]);
        }
        hexHash[64] = 0;

        emitNewHash(hexHash);
    }
}

extern "C" JNIEXPORT void JNICALL
Java_expo_modules_miningmodule_MiningModule_nativeStartMining(JNIEnv *env, jobject module, jstring job) {
    env->GetJavaVM(&jvm);
    miningModuleObject = env->NewGlobalRef(module);
    jclass cls = env->GetObjectClass(module);
    miningModuleClass = (jclass)env->NewGlobalRef(cls);
    onNewHashMethod = env->GetMethodID(miningModuleClass, "onNewHash", "(Ljava/lang/String;)V");

    const char *nativeJob = env->GetStringUTFChars(job, 0);
    std::thread t(mining_thread, std::string(nativeJob));
    t.detach();
    env->ReleaseStringUTFChars(job, nativeJob);
}

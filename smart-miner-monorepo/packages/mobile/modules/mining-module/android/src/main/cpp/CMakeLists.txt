cmake_minimum_required(VERSION 3.18.1)

project(MiningModule)

add_subdirectory(modernRX)

add_library(MiningModule SHARED native-lib.cpp gpu-miner.cpp)

find_library(log-lib log)
find_library(vulkan-lib vulkan)

target_link_libraries(MiningModule ${log-lib} ${vulkan-lib} randomx)

cmake_minimum_required(VERSION 3.18.1)

project(MiningModule)

add_library(MiningModule SHARED native-lib.cpp)

find_library(log-lib log)

target_link_libraries(MiningModule ${log-lib})

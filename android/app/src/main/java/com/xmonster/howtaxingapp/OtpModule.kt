package com.xmonster.howtaxingapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class OtpModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var reactContext: ReactApplicationContext = reactContext

    override fun getName(): String {
        return "OtpModule"
    }

    fun sendOtpToReactNative(otp: String) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("OtpReceived", otp)
    }
}

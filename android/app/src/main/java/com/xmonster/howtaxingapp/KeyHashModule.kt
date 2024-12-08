package com.xmonster.howtaxingapp

import android.content.pm.PackageManager
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.security.MessageDigest

class KeyHashModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "KeyHashModule" // React Native에서 사용할 모듈 이름
    }

    @ReactMethod
    fun getKeyHash(promise: Promise) {
        try {
            val packageInfo = reactApplicationContext.packageManager.getPackageInfo(
                reactApplicationContext.packageName,
                PackageManager.GET_SIGNATURES
            )
            for (signature in packageInfo.signatures) {
                val md = MessageDigest.getInstance("SHA")
                md.update(signature.toByteArray())
                val hashKey = Base64.encodeToString(md.digest(), Base64.DEFAULT)
                Log.e("KeyHash", "hashKey:$hashKey")

                promise.resolve(hashKey)
                return
            }
        } catch (e: Exception) {
            Log.e("KeyHash", "Error while generating Hash Key", e)
            promise.reject("KeyHashError", e)
        }
    }
}
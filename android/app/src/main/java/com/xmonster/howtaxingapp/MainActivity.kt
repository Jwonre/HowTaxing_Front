package com.xmonster.howtaxingapp

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Base64
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.android.gms.auth.api.phone.SmsRetriever
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException

class MainActivity : ReactActivity(), AuthOtpReceiver.OtpReceiveListener {

    private var otpReceiver: AuthOtpReceiver? = null

    override fun getMainComponentName(): String = "HowTaxingRelease"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        getHashKey(this)

        // AppSignatureHelper 사용
        val helper = AppSignatureHelper(this)
        val hash = helper.getAppSignatures()?.get(0)
        Log.d("MainActivity", "App hash: $hash")

        // SMS Retriever 시작
        startSmsRetriever()
    }

    private fun startSmsRetriever() {
        otpReceiver?.let {
            unregisterReceiver(it)
        }

        otpReceiver = AuthOtpReceiver().also {
            it.setOtpListener(this)
            registerReceiver(it, it.doFilter())
        }

        val client = SmsRetriever.getClient(this)
        val task = client.startSmsRetriever()
        task.addOnSuccessListener {
            Log.d("MainActivity", "SMS Retriever 시작 성공")
        }
        task.addOnFailureListener {
            Log.e("MainActivity", "SMS Retriever 시작 실패", it)
        }
    }

    override fun onOtpReceived(otp: String) {
        runOnUiThread {
            Log.d("MainActivity", "Received OTP: $otp")
            val reactContext = reactInstanceManager.currentReactContext as? ReactApplicationContext
            reactContext?.let {
                val otpModule = OtpModule(it)
                otpModule.sendOtpToReactNative(otp)
            }
        }
        startSmsRetriever()
    }

    override fun onDestroy() {
        super.onDestroy()
        otpReceiver?.let {
            unregisterReceiver(it)
        }
    }

    fun getHashKey(context: Context?) {
        var packageInfo: PackageInfo? = null
        try {
            packageInfo = context!!.getPackageManager().getPackageInfo(context!!.getPackageName(), PackageManager.GET_SIGNATURES)
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
        }
        if (packageInfo == null) Log.e("KeyHash", "KeyHash:null")
        for (signature in packageInfo!!.signatures) {
            try {
                val md: MessageDigest = MessageDigest.getInstance("SHA")
                md.update(signature.toByteArray())
                Log.d("KeyHash", Base64.encodeToString(md.digest(), Base64.DEFAULT))
            } catch (e: NoSuchAlgorithmException) {
                Log.e("KeyHash", "Unable to get MessageDigest. signature=$signature", e)
            }
        }
    }
}

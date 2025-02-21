package com.xmonster.howtaxingapp

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Build
import android.util.Base64
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.android.gms.auth.api.phone.SmsRetriever
import java.security.MessageDigest

class MainActivity : ReactActivity(), AuthOtpReceiver.OtpReceiveListener {

    private var otpReceiver: AuthOtpReceiver? = null

    override fun getMainComponentName(): String = "HowTaxingRelease"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initializeApp()
    }

    // 앱 초기화 함수
    private fun initializeApp() {
        getHashKey(this)

        // AppSignatureHelper 사용
        val helper = AppSignatureHelper(this)
        val hash = helper.getAppSignatures()?.getOrNull(0)
        Log.d("MainActivity", "App hash: $hash")

        // SMS Retriever 시작
        startSmsRetriever()
    }

    private fun startSmsRetriever() {
        try {
            otpReceiver?.let {
                unregisterReceiver(it)
            }

            otpReceiver = AuthOtpReceiver().also {
                it.setOtpListener(this)
                registerReceiver(it, it.doFilter(), Context.RECEIVER_EXPORTED) // 플래그 추가
            }

            val client = SmsRetriever.getClient(this)
            val task = client.startSmsRetriever()
            task.addOnSuccessListener {
                Log.d("MainActivity", "SMS Retriever 시작 성공")
            }
            task.addOnFailureListener { e ->
                Log.e("MainActivity", "SMS Retriever 시작 실패", e)
            }
        } catch (e: Exception) {
            Log.e("MainActivity", "startSmsRetriever 예외 발생:", e)
        }
    }

    override fun onOtpReceived(otp: String) {
        runOnUiThread {
            Log.d("MainActivity", "Received OTP: $otp")
            val reactContext = reactInstanceManager?.currentReactContext as? ReactApplicationContext
            reactContext?.let {
                val otpModule = OtpModule(it)
                otpModule.sendOtpToReactNative(otp)
            } ?: run {
                Log.e("MainActivity", "ReactContext가 초기화되지 않았습니다.")
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

    private fun getHashKey(context: Context?) {
        if (context == null) {
            Log.e("KeyHash", "Context is null")
            return
        }

        try {
            val packageInfo = context.packageManager.getPackageInfo(
                context.packageName,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                    PackageManager.GET_SIGNING_CERTIFICATES
                else
                    PackageManager.GET_SIGNATURES
            )

            val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageInfo.signingInfo?.apkContentsSigners
            } else {
                @Suppress("DEPRECATION")
                packageInfo.signatures
            }

            if (signatures == null) {
                Log.e("KeyHash", "Signatures are null")
                return
            }

            for (signature in signatures) {
                val md = MessageDigest.getInstance("SHA")
                val publicKey = signature.toByteArray()
                md.update(publicKey)
                val hash = Base64.encodeToString(md.digest(), Base64.NO_WRAP)
                Log.d("KeyHash", "Hash Key: $hash")
            }
        } catch (e: Exception) {
            Log.e("KeyHash", "Unable to get MessageDigest.", e)
        }
    }
}
package com.xmonster.howtaxingapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

class AuthOtpReceiver : BroadcastReceiver() {

    companion object {
        private const val PATTERN = "^.*\\[Web발신\\]\\s*\\[하우택싱\\]\\s*.+\\[(\\d{6})\\]\\s*.+\$"
        }

    private var otpReceiver: OtpReceiveListener? = null

    override fun onReceive(context: Context, intent: Intent) {
        try {
                    if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
                intent.extras?.let { bundle ->
                    val status = bundle.get(SmsRetriever.EXTRA_STATUS) as Status
                    when (status.statusCode) {
                        CommonStatusCodes.SUCCESS -> {
                            val otpSms = bundle.getString(SmsRetriever.EXTRA_SMS_MESSAGE, "")
                            if (otpReceiver != null && otpSms.isNotEmpty()) {
                                val otp = PATTERN.toRegex().find(otpSms)?.destructured?.component1()
                                if (!otp.isNullOrEmpty()) {
                                    otpReceiver!!.onOtpReceived(otp)
                                }
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("AuthOtpReceiver", "Error in onReceive", e)
        }


    }

    fun setOtpListener(receiver: OtpReceiveListener) {
        this.otpReceiver = receiver
    }

    fun doFilter() = IntentFilter().apply {
        addAction(SmsRetriever.SMS_RETRIEVED_ACTION)
    }

    interface OtpReceiveListener {
        fun onOtpReceived(otp: String)
    }
}

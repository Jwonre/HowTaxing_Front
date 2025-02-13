package com.xmonster.howtaxingapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

class AuthOtpReceiver : BroadcastReceiver() {

    companion object {
        private const val PATTERN = "^.*\\[Web발신\\]\\n\\[하우택싱\\].+\\[(\\d{6})\\].+\$"
        }

    private var otpReceiver: OtpReceiveListener? = null

    override fun onReceive(context: Context, intent: Intent) {
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

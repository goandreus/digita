package pe.com.compartamos.bancamovil;


import static android.content.Context.SENSOR_SERVICE;

import android.Manifest;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;

import java.util.List;

import fingerprint.plusti.com.fingerprintdevice.Handler.FingerprintCreate;

public class FingerprintModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private final FingerprintCreate fingerprintCreate;
    private final SensorManager sensorManager;
    private Sensor accelerometerSensor;
    private final boolean accelerometerPresent;
    private float y_sensor;
    private float z_sensor;

    public FingerprintModule(ReactApplicationContext context) {
        super(context);
        fingerprintCreate = new FingerprintCreate();
        sensorManager = (SensorManager)context.getSystemService(SENSOR_SERVICE);
        List<Sensor> sensorList = sensorManager.getSensorList(Sensor.TYPE_ACCELEROMETER);
        if(sensorList.size() > 0){
            accelerometerPresent = true;
            accelerometerSensor = sensorList.get(0);
        }
        else{
            accelerometerPresent = false;
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "FingerprintModule";
    }

    @ReactMethod()
    public void getFingerprint(Promise promise) {
        if (Build.VERSION.SDK_INT >= 23) {
            Dexter.withActivity(getCurrentActivity())
                    .withPermissions(
                            Manifest.permission.INTERNET,
                            Manifest.permission.ACCESS_NETWORK_STATE,
                            Manifest.permission.ACCESS_WIFI_STATE,
                            Manifest.permission.ACCESS_COARSE_LOCATION,
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.READ_PHONE_STATE,
                            Manifest.permission.USE_FINGERPRINT
                    ).withListener(new MultiplePermissionsListener() {
                        @Override public void onPermissionsChecked(MultiplePermissionsReport report) {
                            //unregister the listener of biometric information
                            //As a best practice in this example we use a Thread for get the information and not affected the performance of the app
                            sensorManager.unregisterListener(accelerometerListener);
                            new Thread(() -> {
                                try {
                                    String fingerprint = fingerprintCreate.generateFingerpintKey("Login", y_sensor,z_sensor,0.2f,0.3f,getCurrentActivity(),"1","BwfSJxuANSbGW0B");
                                    Log.d("JSON", fingerprint);
                                    promise.resolve(fingerprint);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                    promise.reject("Fingerprint error",e);
                                }
                            }).start();
                        }
                        @Override public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                            //unregister the listener of biometric information
                            //As a best practice in this example we use a Thread for get the information and not affected the performance of the app
                            token.continuePermissionRequest();
                            sensorManager.unregisterListener(accelerometerListener);
                            new Thread(() -> {
                                try {
                                    String fingerprint = fingerprintCreate.generateFingerpintKey("Login", y_sensor,z_sensor,0.2f,0.3f,getCurrentActivity(),"1", "BwfSJxuANSbGW0B");
                                    Log.d("JSON", fingerprint);
                                    promise.resolve(fingerprint);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                    promise.reject("Fingerprint error",e);
                                }
                            }).start();
                        }
                    }).check();
        } else {
            //unregister the listener of biometric information
            //As a best practice in this example we use a Thread for get the information and not affected the performance of the app
            sensorManager.unregisterListener(accelerometerListener);
            new Thread(() -> {
                try {
                    String fingerprint = fingerprintCreate.generateFingerpintKey("Login", y_sensor,z_sensor,0.2f,0.3f,getCurrentActivity(),"1", "BwfSJxuANSbGW0B");
                    Log.d("JSON", fingerprint);
                    promise.resolve(fingerprint);
                } catch (Exception e) {
                    e.printStackTrace();
                    promise.reject("Fingerprint error",e);
                }
            }).start();
        }
    }


    @Override
    public void onHostResume() {
        if(accelerometerPresent){
            sensorManager.registerListener(accelerometerListener, accelerometerSensor, SensorManager.SENSOR_DELAY_NORMAL);
        }
    }

    @Override
    public void onHostPause() {
        if(accelerometerPresent){
            sensorManager.unregisterListener(accelerometerListener);
        }
    }

    @Override
    public void onHostDestroy() {

    }

    private final SensorEventListener accelerometerListener = new SensorEventListener(){
        @Override
        public void onAccuracyChanged(Sensor arg0, int arg1) {
        }

        @Override
        public void onSensorChanged(SensorEvent arg0) {
            y_sensor = arg0.values[1];
            z_sensor = arg0.values[2];
        }
    };
}

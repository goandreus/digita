import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const {check, request, PERMISSIONS} = PermissionsAndroid;

export const getLocationPermissions = async () => {
  if(Platform.OS==="android"){
    return check(PERMISSIONS.ACCESS_COARSE_LOCATION);
  }else{
    return false;
  }
};

export const requestLocationPermissions = async () => {
  if(Platform.OS==="android"){
    return request(PERMISSIONS.ACCESS_COARSE_LOCATION);
  }else{
    return Geolocation.requestAuthorization("whenInUse");
  }
  
};

export const getLocation = async (): Promise<
  Geolocation.GeoPosition | undefined
> => {
  const options: Geolocation.GeoOptions = {
    timeout: 15000,
    maximumAge: 10000,
    enableHighAccuracy: true,
  };

  const hasPermission = await getLocationPermissions();

  if (!hasPermission) {
    const status = await requestLocationPermissions();
    if (status !== 'granted') {
      return;
    }
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(values => resolve(values), reject, options);
  });
};

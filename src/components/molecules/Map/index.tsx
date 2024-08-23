import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import MapView, {
  Marker,
  Region,
  Callout,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from '@atoms/Icon';
import {Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import {haversine} from '@helpers/haversine';

import CustomCallout from './CustomCallout';
import {mapStyle} from '../../../data/mapStyles';
import {getLocation} from '@helpers/getLocation';
import {Canal} from 'src/interface/Canal';
import {Canales} from '@interface/Canal';

interface Props {
  canalSelected?: Canales;
  onChangePlacesIds?: (ids: string[]) => void;
}

const Map = ({canalSelected, onChangePlacesIds}: Props) => {
  const mapRef = useRef<MapView | null>(null);
  const [markers, setMarkers] = useState<Canal[]>([]);

  const filterPlaces = useCallback(
    (lat: number, lng: number) => {
      const ids: string[] = [];

      for (const {id, coor} of []) {
        if (haversine(lat, lng, coor[1], coor[0])) {
          ids.push(id);
        }
      }

      onChangePlacesIds?.(ids);
    },
    [onChangePlacesIds],
  );

  const handleRegionChange = useCallback(
    ({latitude, longitude}: Region) => {
      filterPlaces(latitude, longitude);
    },
    [filterPlaces],
  );

  const checkMarkers = useCallback(async () => {
    
  }, []);

  const loadMarkers = useCallback(async (canal: Canales) => {
  }, []);

  const handleMapLoad = useCallback(async () => {
    const location = await getLocation();

    if (location) {
      const payload = {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      };

      mapRef.current?.animateToRegion({
        ...payload,
        latitudeDelta: 0.01,
        longitudeDelta: 0.015,
      });

      filterPlaces(payload.latitude!, payload.longitude!);

      await checkMarkers();
      await loadMarkers(Canales.AGENCIA);
    }
  }, [filterPlaces, loadMarkers, checkMarkers]);

  useEffect(() => {
    if (canalSelected) {
      loadMarkers(canalSelected);
    }
  }, [canalSelected]);

  return (
    <View style={styles.container} onLayout={handleMapLoad}>
      <MapView
        ref={mapRef}
        zoomEnabled
        loadingEnabled
        zoomControlEnabled
        showsUserLocation
        style={styles.map}
        mapType="standard"
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleRegionChange}
        >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            image={require("../../../assets/images/marker.png")}
            coordinate={{
              latitude: marker.geometry.coordinates[1],
              longitude: marker.geometry.coordinates[0],
            }}>
            <Callout tooltip>
              <CustomCallout style={styles.callout}>
                <TextCustom
                  weight="bold"
                  variation="small"
                  color={Colors.Primary}
                  text={marker.properties.name}
                />
                <TextCustom
                  text={marker.properties.address}
                  variation="small"
                />
              </CustomCallout>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default React.memo(Map);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 434,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  callout: {
    width: 230,
  },
});

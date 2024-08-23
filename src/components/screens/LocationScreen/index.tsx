/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

import {Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import {FontSizes} from '@theme/fonts';
import Input from '@atoms/Input';
import Button from '@atoms/Button';
import Tabs from '@molecules/Tabs';
import TabList from '@molecules/Tabs/TabList';
import TabButton from '@molecules/Tabs/TabButton';
import TabPanels from '@molecules/Tabs/TabPanels';
import Map from '@molecules/Map';
import CanalesList from '@molecules/CanalesList';
import Drawer from '@molecules/Drawer';
import useToggle from '@hooks/useToggle';
import Icon from '@atoms/Icon';
import Checkbox from '@atoms/Checkbox';
import {Canales} from '@interface/Canal';

const BimOptions = [
  'Agentes Bim',
  'Bimers',
  'Red YaGanaste',
  'Red GoPay',
  'Cajeros Afiliados',
  'Agentes Afiliados',
  'KasNet',
];

const CanalButton = ({
  text,
  isActive,
  onPress,
}: {
  text: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.canal,
          isActive ? styles.canal_active : styles.canal_inactive,
        ]}>
        <TextCustom
          text={text}
          color="#fff"
          weight="bold"
          variation="small"
          size={FontSizes.Tiny}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const LocationScreen = () => {
  const {isOpen, onClose, onOpen} = useToggle();
  const [searchText, setSearchText] = useState('');
  const [placesIds, setPlacesIds] = useState<string[]>([]);
  const [canalSelected, setCanalSelected] = useState<Canales>(Canales.AGENCIA);
  const [agentesBimSelected, setAgentesBimSelected] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);

  const handlePlaces = useCallback((ids: string[]) => {
    setPlacesIds(ids);
  }, []);

  return (
    <View>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={Colors.Transparent}
      />

      <View style={styles.container}>
        <TextCustom
          variation="p"
          weight="bold"
          text="¿Qué necesitas?"
          color={Colors.Primary}
          style={{marginBottom: 8}}
        />
        <View style={styles.canales}>
          <CanalButton
            text="Agencia"
            isActive={canalSelected === Canales.AGENCIA}
            onPress={() => setCanalSelected(Canales.AGENCIA)}
          />
          <CanalButton
            text="BIM"
            isActive={canalSelected === Canales.BIM}
            onPress={() => {
              onOpen();
              setCanalSelected(Canales.BIM);
            }}
          />
          <CanalButton
            text="Agentes"
            isActive={canalSelected === Canales.AGENTE}
            onPress={() => setCanalSelected(Canales.AGENTE)}
          />
          <CanalButton
            text="Cajeros"
            isActive={canalSelected === Canales.CAJERO}
            onPress={() => setCanalSelected(Canales.CAJERO)}
          />
          <CanalButton
            text="Canales"
            isActive={canalSelected === Canales.CANALES}
            onPress={() => setCanalSelected(Canales.CANALES)}
          />
        </View>

        <View style={styles.search_box}>
          <Input
            value={searchText}
            onChange={setSearchText}
            style={styles.search_input}
            placeholder="Busca por calle, ciudad, dpto..."
          />

          <Button
            onPress={() => {}}
            icon="search"
            iconSize="tiny"
            type="secondary"
            orientation="horizontal"
            containerStyle={styles.search_button}
          />
        </View>

        <TextCustom
          variation="p"
          weight="bold"
          color={Colors.Primary}
          style={{marginBottom: 16}}
          text="Encontramos estas Agencias cerca de ti."
        />

        <Tabs>
          <TabList>
            <TabButton text="Mapa" icon="place" />
            <TabButton text="Lista" icon="list" />
          </TabList>
          <TabPanels>
            <Map
              canalSelected={canalSelected}
              onChangePlacesIds={handlePlaces}
            />
            <CanalesList placeIds={placesIds} />
          </TabPanels>
        </Tabs>

        <Drawer isOpen={isOpen} onClose={onClose}>
          <View
            style={{
              marginBottom: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextCustom
              size={16}
              variation="p"
              weight="bold"
              text="Selecciona tu agentes de BIM"
            />

            <Pressable onPress={onClose}>
              <Icon name="close-small" size="small" />
            </Pressable>
          </View>

          {BimOptions.map((text, i) => {
            const isActive = agentesBimSelected.some(index => index === i);

            return (
              <View
                key={i}
                style={[
                  {
                    paddingVertical: 9,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    justifyContent: 'space-between',
                  },
                  i !== BimOptions.length - 1
                    ? {borderBottomColor: '#C4C4C4'}
                    : {borderBottomColor: 'transparent'},
                ]}>
                <TextCustom size={16} variation="p" weight="bold" text={text} />

                <Checkbox
                  type="primary"
                  value={isActive}
                  onChange={() =>
                    setAgentesBimSelected(prev => {
                      return isActive
                        ? prev.filter(index => index !== i)
                        : [...prev, i];
                    })
                  }
                />
              </View>
            );
          })}
        </Drawer>
      </View>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 23,
  },
  canales: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  canal: {
    width: 58,
    height: 39,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canal_active: {
    backgroundColor: Colors.Primary,
  },
  canal_inactive: {
    backgroundColor: Colors.Placeholder,
  },
  search_box: {
    height: 8 * 6,
    flexDirection: 'row',
    marginBottom: 16,
  },
  search_input: {
    flex: 1,
    padding: 0,
    marginRight: 8,
  },
  search_button: {
    width: 42,
    minHeight: 8 * 6,
  },
});

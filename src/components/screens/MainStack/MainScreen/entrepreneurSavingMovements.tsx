/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  LogBox,
  Pressable,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/Separator';
import BoxView from '@atoms/BoxView';
import AlertBasic from '@molecules/extra/AlertBasic';
import Button from '@atoms/extra/Button';
import {Movement, getSavingMovements} from '@services/Accounts';
import {HeaderStack} from '@molecules/extra/HeaderStack';
import Icon from '@atoms/Icon';
import {SIZES} from '@theme/metrics';
import {COLORS} from '@theme/colors';

const Pill = ({
  title,
  action,
  isActive,
  disabled,
  setActivePill,
}: {
  title: string;
  action: () => void;
  isActive: boolean;
  disabled: boolean;
  setActivePill: (title: string) => void;
}) => (
  <Pressable
    disabled={disabled}
    onPress={() => {
      setActivePill(title);
      action();
    }}>
    <BoxView
      style={{
        width: title === 'Hoy' ? 60 : 80,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isActive ? COLORS.Primary.Medium : COLORS.Neutral.Medium,
        marginLeft: title === 'Hoy' ? undefined : 4,
      }}
      py={8}
      background={isActive ? 'primary-lightest' : 'neutral-lightest'}
      justify="center"
      align="center">
      <TextCustom
        text={title}
        variation="h4"
        weight="normal"
        color={isActive ? 'primary-medium' : 'neutral-darkest'}
      />
    </BoxView>
  </Pressable>
);

const MovementItem = ({item}: {item: Movement}) => (
  <BoxView style={styles.movementContainer} py={16}>
    <BoxView direction="row" align="center" justify="space-between">
      <BoxView>
        <TextCustom
          text={item.concept.trimEnd()}
          variation="h4"
          weight="normal"
          color="neutral-darkest"
        />
        <Separator size={8} />
        <TextCustom
          text={`${item.dayString} ${item.monthString}, ${item.time}`}
          variation="h6"
          weight="normal"
          color="neutral-dark"
        />
      </BoxView>
      <TextCustom
        text={
          item.debitCredit === 'D'
            ? `-S/ ${item.samount}`
            : `S/ ${item.samount}`
        }
        variation="h4"
        weight="normal"
        color={item.debitCredit === 'D' ? 'error-medium' : 'neutral-darkest'}
      />
    </BoxView>
  </BoxView>
);

const EntrepreneurSavingMovements = ({navigation, route}) => {
  const {operationId} = route.params;
  const [activePill, setActivePill] = useState('Hoy');
  const [lastDays, setLastDays] = useState<string>('');
  const [totalMovements, setTotalMovements] = useState<number>(0);
  const [alert, setAlert] = useState<boolean>(false);
  const [filteredMovements, setFilteredMovements] = useState<[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const getMovements = async (numberOfDays: string) => {
    setFilteredMovements([]);
    setIsLoading(true);
    if (numberOfDays !== lastDays) {
      try {
        const savingMovements = await getSavingMovements({
          operationUId: operationId,
          payload: {
            numberOfMovements: '30',
            numberOfDays: numberOfDays,
          },
        });
        const movementsSav = savingMovements?.movements;
        setTotalMovements(movementsSav.length);
        const monthsMovements = movementsSav?.map(
          (e: {monthString: string; yearString: string}) =>
            `${e.monthString}-${e.yearString}`,
        );
        const filteredMonths = [...new Set(monthsMovements)];
        const result = filteredMonths.map(e => ({
          month: e?.split('-')[0],
          year: e?.split('-')[1],
          data: movementsSav?.filter(
            (m: {monthString: string; yearString: string}) =>
              m.monthString === e?.split('-')[0] &&
              m.yearString === e?.split('-')[1],
          ),
        }));
        setFilteredMovements(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLastDays(numberOfDays);
        setIsLoading(false);
      }
    }
  };

  useLayoutEffect(() => {
    getMovements('1');
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.Transparent}
        translucent={true}
      />
      <BoxView style={styles.headerBorder} mt={2}>
        <HeaderStack
          canGoBack={navigation.canGoBack()}
          onBack={() => navigation.goBack()}
          title={'Filtra tus movimientos'}
        />
      </BoxView>
      <ScrollView style={{flex: 1}}>
        <BoxView p={24} background="background-light" align="center">
          <BoxView style={{width: '100%'}}>
            <TextCustom
              text="Movimientos"
              variation="h0"
              size={22}
              weight="normal"
              color="primary-medium"
            />
            <Separator size={4} />
            <TextCustom
              style={{width: '100%'}}
              text="Puedes ver los últimos 30 movimientos de cada filtro"
              variation="h5"
              weight="normal"
              color="neutral-darkest"
            />
          </BoxView>
          <Separator size={24} />
          <BoxView
            style={{width: '100%'}}
            direction="row"
            justify="space-between"
            alignSelf="center">
            <Pill
              disabled={isloading}
              isActive={activePill === 'Hoy'}
              title="Hoy"
              action={() => getMovements('1')}
              setActivePill={setActivePill}
            />
            <Pill
              disabled={isloading}
              isActive={activePill === '03 días'}
              title="03 días"
              action={() => getMovements('3')}
              setActivePill={setActivePill}
            />
            <Pill
              disabled={isloading}
              isActive={activePill === '07 días'}
              title="07 días"
              action={() => getMovements('7')}
              setActivePill={setActivePill}
            />
            <Pill
              disabled={isloading}
              isActive={activePill === '30 días'}
              title="30 días"
              action={() => getMovements('30')}
              setActivePill={setActivePill}
            />
          </BoxView>
        </BoxView>
        {filteredMovements.length > 0 ? (
          <>
            <SectionList
              style={styles.sectionList}
              keyExtractor={item => item.movementUId + item.concept}
              sections={filteredMovements}
              renderSectionHeader={({section}) =>
                section.data.length > 0 ? (
                  <BoxView mt={-12} py={16}>
                    <TextCustom
                      variation="h4"
                      text={
                        `${section.month.charAt(0)}`.toUpperCase() +
                        `${section.month.slice(1)}` +
                        ` ${section.year}`
                      }
                      color="neutral-dark"
                    />
                  </BoxView>
                ) : null
              }
              renderItem={MovementItem}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              stickySectionHeadersEnabled={false}
            />
            {totalMovements === 30 ? (
              <Pressable onPress={() => setAlert(true)}>
                <BoxView background="background-lightest" py={12} mt={12}>
                  <TextCustom
                    align="center"
                    text="Más movimientos"
                    variation="h4"
                    weight="normal"
                    color="primary-medium"
                  />
                </BoxView>
              </Pressable>
            ) : null}
          </>
        ) : (
          <View style={styles.noMovements}>
            <Icon name="icon_wallet-sad" size={90} />
            <Separator size={SIZES.MD} />
            <TextCustom
              size={16}
              text="Aún no hay movimientos"
              variation="h2"
              weight="normal"
              color="neutral-darkest"
            />
          </View>
        )}
        {alert ? (
          <AlertBasic
            isOpen={alert}
            title={'¿Necesitas ver más movimientos?'}
            body={
              <TextCustom
                // eslint-disable-next-line react-native/no-inline-styles
                style={{lineHeight: 24}}
                text="Por ahora, solo puedes ver tus últimos 30 movimientos. Si deseas ver más movimientos acércate a una agencia y solicita tu estado de cuenta."
                color="neutral-darkest"
                variation="p4"
                weight="normal"
                align="center"
              />
            }
            actions={() => [
              {
                id: 'button1',
                render: (
                  <Button
                    orientation="vertical"
                    text="Entiendo"
                    type="primary"
                    onPress={() => setAlert(false)}
                  />
                ),
              },
            ]}
            onClose={() => {}}
          />
        ) : null}
      </ScrollView>
    </>
  );
};

export default EntrepreneurSavingMovements;

const styles = StyleSheet.create({
  headerBorder: {
    borderTopWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.01)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 12,
    zIndex: 1,
  },
  primaryPill: {
    width: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.Primary.Medium,
  },
  secondaryPill: {
    width: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.Neutral.Medium,
    marginLeft: 4,
  },
  movementContainer: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 16,
    borderColor: COLORS.Neutral.Light,
  },
  sectionList: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  noMovements: {
    marginTop: '50%',
    alignItems: 'center',
  },
});

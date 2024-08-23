/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import SvgSearch from '@assets/icons/SvgSearch';
import serviceNotFound from '@assets/images/serviceNotFound.png';
import serviceSearch from '@assets/images/serviceSearch.png';
import SvgSearchClose from '@assets/icons/SvgSearchClose';
import TextCustom from '@atoms/extra/TextCustom';
import {COLORS} from '@theme/colors';
import {FONTS, FONTS_LINE_HEIGHTS_FACTOR, FONT_SIZES} from '@theme/fonts';
import {SIZES} from '@theme/metrics';
import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {Image, Pressable, Text, TextInput, View} from 'react-native';
import MenuItem from './PayServices/MenuItem';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PayServicesTemplate from '@templates/extra/PayServicesTemplate';
import {useNavigation, useRoute} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {
  GetCategories,
  GetCompanyDetail,
  getTransferCompanies,
} from '../../../services/Transactions/index';
import HighlightText from '@sanar/react-native-highlight-text';
import {useAppSelector} from '@hooks/useAppSelector';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {update} from '@features/categories';
import {PayServicesRootStackScreenProps} from '@navigations/types';
import {update as updateCategory} from '@features/categoryInPayment';
import AlertBasic from '@molecules/extra/AlertBasic';
import Button from '@atoms/extra/Button';
import {v4 as uuid} from 'uuid';
import moment from 'moment';
const PATTERN = /^[a-zA-Z0-9 áéíóú&ñÑ]+$/;

interface ICompany {
  categoryInternalId: number;
  code: string;
  groupId: string;
  id: number;
  name: string;
}

enum statusEnum {
  base = 0,
  search = 1,
  results = 2,
  loading = 3,
  notFound = 4,
}

const PayServicesScreen = (props: PayServicesRootStackScreenProps) => {
  useEffect(() => {
    getCompanies();
  }, []);

  const dispatch = useAppDispatch();
  const userDocumentNumber = useAppSelector(
    state => state.user?.user?.person?.documentNumber,
  );
  const userDocumentType = useAppSelector(
    state => state.user?.user?.person?.documentTypeId,
  );
  const route = useRoute();
  const screen = route.name;
  const categories = useAppSelector(state => state.categories);
  const [showModalReattempt, setShowModalReattempt] = useState<{
    open: boolean;
    company?: ICompany;
  }>({open: false, company: undefined});
  const [showModalError, setShowModalError] = useState<
    'IN_PROGRESS' | 'OPENED' | 'NONE'
  >('NONE');
  const [goToMain, setGoToMain] = useState<'IN_PROGRESS' | 'NONE'>('NONE');
  const [scheduleModal, setScheduleModal] = useState({
    open: false,
    values: {open: '', close: ''},
  });
  const [isLoadingReattempt, setIsLoadingReattempt] = useState(false);
  const [isAllowedToBlockReattempt, setIsAllowedToBlockReattempt] =
    useState(true);
  const refBlockRequest = useRef<
    {type: 'BLOCK'} | {type: 'ALLOW'; payload: string} | undefined
  >(undefined);
  const [categorySelected, setCategorySelected] = useState<
    {title: string; id: number} | undefined
  >(undefined);
  const [text, setText] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [companies, setCompanies] = useState<ICompany[]>();

  const [status, setStatus] = useState<statusEnum>(statusEnum.base);
  const [filterCompanies, setFilterCompanies] = useState<ICompany[]>();
  const inputRef = useRef<TextInput>(null);
  const isSearchBoxEnhanced = text.length > 0 || isFocused;
  const showClearButton = text.length > 0;

  const navigation = useNavigation();

  const getCompanies = async () => {
    try {
      const _companies = await getTransferCompanies({
        documentType: userDocumentType,
        documentNumber: userDocumentNumber,
      });
      setCompanies(_companies);
    } catch (error) {}
  };

  const handleSearchText = (t: string) => {
    if (t === '' || PATTERN.test(t)) {
      setText(t);

      if (t.replace(/ /g, '').length >= 3) {
        filter(t);
      } else {
        setStatus(statusEnum.search);
      }
    }
  };

  const filter = (word: string) => {
    if (word) {
      let newCompanies = companies?.filter(
        e =>
          e.name.toLowerCase().includes(word.toLowerCase()) &&
          e.categoryInternalId !== 1,
      );

      if (categorySelected) {
        newCompanies = newCompanies?.filter(
          e => e.categoryInternalId === categorySelected.id,
        );
      }
      if (newCompanies && newCompanies.length > 0) {
        setFilterCompanies(newCompanies);
        setStatus(statusEnum.results);
      } else {
        setStatus(statusEnum.notFound);
      }
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (
          userDocumentType !== undefined &&
          userDocumentNumber !== undefined
        ) {
          const _categories = await GetCategories({
            documentType: userDocumentType,
            documentNumber: userDocumentNumber,
            screenName: screen,
          });
          if (
            Array.isArray(_categories.data) &&
            _categories.isSuccess === true &&
            _categories.data.length > 0
          )
            dispatch(update(_categories.data));
          else throw new Error('Ocurrió un error');
        } else throw new Error('Ocurrió un error');
      } catch (error) {
        if (navigation.canGoBack()) navigation.goBack();
      }
    };

    if (categories.length === 0) loadCategories();
  }, [screen, userDocumentType, userDocumentNumber, categories, navigation]);

  const clearSearchBox2 = () => {
    setIsFocused(true);

    setText('');
    setFilterCompanies([]);
    setStatus(statusEnum.search);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const clearSearchBox = useCallback((blur: boolean) => {
    setText('');
    setFilterCompanies([]);
    setStatus(statusEnum.base);
    setIsFocused(false);
    setCategorySelected(undefined);
    if (blur)
      setTimeout(() => {
        inputRef.current?.blur();
      });
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        if (text.length > 0 || (text.length === 0 && isFocused === true)) {
          clearSearchBox(true);
          e.preventDefault();
        } else if (categorySelected !== undefined) {
          setCategorySelected(undefined);
          clearSearchBox(true);
          e.preventDefault();
        }
      }
    });
    return () => unsubscribe();
  }, [navigation, categorySelected, text, clearSearchBox, isFocused]);

  const Categories = useMemo(() => {
    let render: React.ReactNode[] = [];
    /*    const hasString = (target: string, substring: string) =>
      _.lowerCase(target).includes(substring); */
    const onPress = (title: string, id: number) => {
      setIsFocused(true);

      setText('');
      setFilterCompanies([]);
      setStatus(statusEnum.search);
      setCategorySelected({title: title, id});
      setTimeout(() => {
        inputRef.current?.focus();
      });
    };
    categories.forEach(category => {
      if (category.id === 1)
        render.push(
          <MenuItem
            key="celular"
            iconName="icon_recharge_phone"
            label={category.name}
            onPress={() => {
              navigation.navigate('PhoneRechargeScreen');
            }}
          />,
        );
      else if (category.id === 2)
        render.push(
          <MenuItem
            key="agua"
            iconName="icon_droplet"
            label={category.name}
            onPress={() => onPress(category.name, category.id)}
          />,
        );
      else if (category.id === 3)
        render.push(
          <MenuItem
            key="internet"
            iconName="icon_phone"
            label={category.name}
            onPress={() => onPress(category.name, category.id)}
          />,
        );
      else if (category.id === 4)
        render.push(
          <MenuItem
            key="empresa"
            iconName="icon_building"
            label={category.name}
            onPress={() => onPress(category.name, category.id)}
          />,
        );
    });
    return render;
  }, [categories, clearSearchBox]);

  const NotFound = useMemo(
    () => (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 96,
        }}>
        <View>
          <Image source={serviceNotFound} style={{height: 64, width: 64}} />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontFamily: FONTS.Bree,
            marginTop: 8,
            color: '#97A3B6',
          }}>
          No hemos encontrado la empresa
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontFamily: FONTS.Bree,
            marginTop: 8,
            color: '#697385',
          }}>
          Por el momento no contamos con la empresa o{'\n'}
          institución que ingresaste. Por favor intenta nuevamente.
        </Text>
      </View>
    ),
    [],
  );

  const Search = useMemo(
    () => (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 96,
        }}>
        <View>
          <Image style={{width: 64, height: 64}} source={serviceSearch} />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontFamily: FONTS.Bree,
            color: '#97A3B6',
            marginTop: 8,
          }}>
          Realiza tu búsqueda por empresa
        </Text>
      </View>
    ),
    [],
  );


  const GoToCompanyFromItem = useCallback(
    async (company: ICompany) => {
      try {
        if (userDocumentType === undefined || userDocumentNumber === undefined)
          return;
        inputRef.current?.blur();
        props.navigation.navigate('LoadingFishes', {
          screenId: 'LoadingFishesX',
        });

        const data = await GetCompanyDetail({
          company: {
            businessName: company.name,
            code: company.code,
            groupId: company.groupId,
          },
          user: {
            documentType: userDocumentType,
            documentNumber: userDocumentNumber,
          },
          screeName: screen,
        });
        clearSearchBox(false);
        dispatch(
          updateCategory({
            businessName: data.businessName,
            services: data.services,
            company: company,
          }),
        );

        if (data.services.length === 1 && !data.services[0].isAvailable) {
          props.navigation.goBack();
          let open = '';
          let close = '';
          if (data.services[0].attentionSchedule.includes('-')) {
            const sch = data.services[0].attentionSchedule.split(' - ');
            open = sch[0];
            close = sch[1];
          }
          setScheduleModal({
            ...scheduleModal,
            open: true,
            values: {
              open,
              close,
            },
          });
        } else {
          props.navigation.replace('PayService');
        }
      } catch (error) {
        props.navigation.pop();
        setShowModalReattempt({open: true, company: company});
      }
    },
    [
      props.navigation,
      clearSearchBox,
      screen,
      userDocumentType,
      userDocumentNumber,
    ],
  );

  const GoToCompanyFromModal = useCallback(
    async (company: ICompany) => {
      if (userDocumentType === undefined || userDocumentNumber === undefined)
        return;
      let id = uuid();
      refBlockRequest.current = {
        type: 'ALLOW',
        payload: id,
      };
      try {
        setIsLoadingReattempt(true);
        const data = await GetCompanyDetail({
          company: {
            businessName: company.name,
            code: company.code,
            groupId: company.groupId,
          },
          user: {
            documentType: userDocumentType,
            documentNumber: userDocumentNumber,
          },
          screeName: screen,
        });
        if (
          refBlockRequest.current !== undefined &&
          refBlockRequest.current.type === 'ALLOW' &&
          refBlockRequest.current.payload === id
        ) {
          dispatch(
            updateCategory({
              businessName: data.businessName,
              services: data.services,
              company: company,
            }),
          );
          setIsLoadingReattempt(false);
          setShowModalReattempt({open: false, company: undefined});
          clearSearchBox(false);
          if (data.services.length === 1 && !data.services[0].isAvailable) {
            let open = '';
            let close = '';
            if (data.services[0].attentionSchedule.includes('-')) {
              const sch = data.services[0].attentionSchedule.split(' - ');
              open = sch[0];
              close = sch[1];
            }
            setTimeout(() => {
              setScheduleModal({
                ...scheduleModal,
                open: true,
                values: {
                  open,
                  close,
                },
              });
            }, 350);
          } else {
            props.navigation.navigate('PayService');
          }
        }
      } catch (error) {
        if (
          refBlockRequest.current !== undefined &&
          refBlockRequest.current.type === 'ALLOW' &&
          refBlockRequest.current.payload === id
        ) {
          setIsLoadingReattempt(false);
          setShowModalReattempt({open: false, company: undefined});
          setShowModalError('IN_PROGRESS');
        }
      }
    },
    [
      props.navigation,
      clearSearchBox,
      screen,
      userDocumentNumber,
      userDocumentType,
    ],
  );

  const Results = useMemo(() => {
    return (
      <View style={{backgroundColor: 'white'}}>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: 48,
              borderBottomWidth: 1,
              borderBottomColor: '#EFEFEF',
            }}>
            <Text
              style={{
                fontFamily: FONTS.Bree,
                fontSize: 16,
                color: '#222D42',
              }}>
              {filterCompanies?.length}{' '}
              {filterCompanies?.length === 1
                ? 'resultado encontrado'
                : 'resultados encontrados'}
            </Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 16}}>
          {filterCompanies &&
            filterCompanies.map(e => (
              <Pressable
                key={e.id}
                onPress={() => GoToCompanyFromItem(e)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 45,
                  borderBottomWidth: 1,
                  borderBottomColor: '#EFEFEF',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.AmorSansPro,
                    fontSize: 16,
                    color: '#665F59',
                    fontWeight: '400',
                  }}>
                  <HighlightText
                    highlightStyle={{
                      fontFamily: FONTS.AmorSansPro,
                      color: '#CA005D',
                      fontWeight: '700',
                    }}
                    //@ts-ignore
                    searchWords={[text]}
                    textToHighlight={e.name}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  />
                </Text>

                <View>
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.46869 18.0303C8.1758 17.7374 8.1758 17.2626 8.46869 16.9697L13.9384 11.5L8.46869 6.03033C8.1758 5.73744 8.1758 5.26256 8.46869 4.96967C8.76159 4.67678 9.23646 4.67678 9.52935 4.96967L15.5294 10.9697C15.8222 11.2626 15.8222 11.7374 15.5294 12.0303L9.52935 18.0303C9.23646 18.3232 8.76159 18.3232 8.46869 18.0303Z"
                      fill="#CA005D"
                      stroke="#CA005D"
                      stroke-width="0.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </Svg>
                </View>
              </Pressable>
            ))}
        </View>
      </View>
    );
  }, [filterCompanies, GoToCompanyFromItem]);

  const DrawStatus = useMemo(() => {
    switch (status) {
      case statusEnum.search:
        return Search;

      case statusEnum.results:
        return Results;
      case statusEnum.notFound:
        return NotFound;
      default:
        return <></>;
    }
  }, [Search, NotFound, Results, status]);

  useLayoutEffect(() => {
    if (isLoadingReattempt) {
      setIsAllowedToBlockReattempt(false);
      const id = setTimeout(() => {
        setIsAllowedToBlockReattempt(true);
      }, 3000);
      return () => clearTimeout(id);
    } else setIsAllowedToBlockReattempt(true);
  }, [isLoadingReattempt]);

  return (
    <>
      <PayServicesTemplate
        headerTitle={categorySelected?.title || 'Servicios'}
        canGoBack={navigation.canGoBack()}
        goBack={() => {
          navigation.goBack();
          clearSearchBox(true);
        }}>
        <View
          style={{
            backgroundColor: COLORS.Background.Light,
            paddingHorizontal: SIZES.XS * 2,
            paddingTop: SIZES.XS * 2,
            paddingBottom: SIZES.XS * 3,
          }}>
          <TextCustom
            style={{marginBottom: 8}}
            variation="h4"
            color="primary-medium">
            Busca o selecciona la empresa
          </TextCustom>
          <View
            style={{
              borderRadius: 4,
              borderColor: isSearchBoxEnhanced
                ? COLORS.Neutral.Darkest
                : COLORS.Neutral.Dark,
              borderWidth: 1,
              backgroundColor: 'white',
              flexDirection: 'row',
              position: 'relative',
            }}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: SIZES.XS * 3,
                zIndex: 2,
                justifyContent: 'center',
                bottom: 0,
                top: 0,
              }}>
              <SvgSearch
                width={25}
                height={25}
                color={
                  isSearchBoxEnhanced
                    ? COLORS.Neutral.Darkest
                    : COLORS.Neutral.Dark
                }
              />
            </View>
            <TextInput
              ref={inputRef}
              onFocus={() => {
                setIsFocused(true);
                handleSearchText(text);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              value={text}
              onChangeText={t => {
                handleSearchText(t);
              }}
              style={{
                zIndex: 1,
                paddingLeft: SIZES.XS * 4 + 25,
                flex: 1,
                paddingVertical: SIZES.XS * 2,
                fontSize: FONT_SIZES.MD,
                color: COLORS.Neutral.Darkest,
                fontFamily: FONTS.AmorSansPro,
                lineHeight: FONT_SIZES.MD * FONTS_LINE_HEIGHTS_FACTOR.TIGHT,
              }}
              placeholderTextColor={COLORS.Neutral.Dark}
              placeholder="Buscar empresa"
              autoCapitalize="none"
            />
            {showClearButton && (
              <Pressable
                onPress={() => {
                  clearSearchBox2();
                }}
                style={{
                  paddingLeft: SIZES.XS,
                  paddingRight: SIZES.XS * 3,
                  justifyContent: 'center',
                }}>
                <SvgSearchClose
                  width={25}
                  height={25}
                  color={COLORS.Neutral.Darkest}
                />
              </Pressable>
            )}
          </View>
          <TextCustom
            variation="p6"
            color="neutral-dark"
            style={{
              paddingTop: SIZES.XS,
            }}>
            Para buscar ingresa al menos 3 caracteres
          </TextCustom>
        </View>
        {!isFocused ? (
          <>
            {text.length === 0 && (
              <KeyboardAwareScrollView
                bounces={false}
                enableOnAndroid={true}
                style={{
                  backgroundColor: COLORS.Background.Lightest,
                  flex: 1,
                }}>
                {categorySelected === undefined && Categories}
              </KeyboardAwareScrollView>
            )}
            {text.length > 0 && DrawStatus}
          </>
        ) : (
          DrawStatus
        )}
      </PayServicesTemplate>
      <AlertBasic
        onClose={() => {
          refBlockRequest.current = {
            type: 'BLOCK',
          };
          setIsLoadingReattempt(false);
          setShowModalReattempt({open: false, company: undefined});
        }}
        closeOnTouchBackdrop={isAllowedToBlockReattempt}
        isOpen={showModalReattempt.open}
        onModalHide={() => {
          if (showModalError === 'IN_PROGRESS') setShowModalError('OPENED');
        }}
        title="Lo sentimos"
        description="No logramos mostrar la información. Por favor vuelve a intentar de nuevo."
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Volver a cargar"
                type="primary"
                loading={isLoadingReattempt}
                onPress={() => {
                  if (showModalReattempt.company !== undefined) {
                    GoToCompanyFromModal(showModalReattempt.company);
                  } else utils.close();
                }}
              />
            ),
          },
        ]}
      />
      <AlertBasic
        onClose={() => setShowModalError('NONE')}
        closeOnTouchBackdrop={true}
        isOpen={showModalError === 'OPENED'}
        onModalHide={() => {
          if (goToMain === 'IN_PROGRESS') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'MainTab'}],
            });
          }
        }}
        title="Lo sentimos"
        description="No logramos mostrar la información de la empresa. Por favor intentalo más tarde."
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Entiendo"
                type="primary"
                onPress={() => {
                  setGoToMain('IN_PROGRESS');
                  utils.close();
                }}
              />
            ),
          },
        ]}
      />

      <AlertBasic
        onClose={() => {
          setScheduleModal({...scheduleModal, open: false});
        }}
        closeOnTouchBackdrop={true}
        isOpen={scheduleModal.open}
        onModalHide={() => {}}
        title={`El pago de este ${'\n'} servicio no esta disponible`}
        customDescription={() => (
          <TextCustom
            color="neutral-darkest"
            lineHeight="comfy"
            variation="p4"
            weight="normal"
            align="center">
            ¡Recuerda! puedes realizar el pago de este {'\n'} servicio de{' '}
            <Text style={{fontFamily: FONTS.AmorSansProBold}}>
              {moment(scheduleModal.values.open, 'HH:mm').format('h:mm a')}
            </Text>{' '}
            a{' '}
            <Text style={{fontFamily: FONTS.AmorSansProBold}}>
              {moment(scheduleModal.values.close, 'HH:mm').format('h:mm a')}.
            </Text>
          </TextCustom>
        )}
        actions={utils => [
          {
            id: 'button1',
            render: (
              <Button
                text="Entiendo"
                type="primary"
                onPress={() => {
                  utils.close();
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default PayServicesScreen;

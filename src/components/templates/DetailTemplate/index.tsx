import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Share,
} from 'react-native';
import Toast, {BaseToast, BaseToastProps} from 'react-native-toast-message';
import { ScreenSize } from '@theme/metrics';
import {Colors} from '@theme/colors';
import TextCustom from '@atoms/TextCustom';
import Separator from '@atoms/Separator';
import Icon from '@atoms/Icon';
import Svg, { Path } from 'react-native-svg';
import Clipboard from '@react-native-community/clipboard';
interface SavingsTemplateProps {
  children?: React.ReactNode;
  top?: any;
  right?: any;
  user?: any;
  title?: string;
  detail?: boolean;
  accountName?: string;
  accountNumber?: string;
  cci?: string;
  currency?: string;
  productType?: string;
  type?: string;
  action: () => void
}

const DetailTemplate = ({
  children,
  title,
  detail,
  accountNumber,
  currency,
  type,
  action
}: SavingsTemplateProps) => {

  const onShare = async () => {
    const nameCurrency = currency === 'S/' ? 'Soles' : 'Dólares'
    try {
      const result = await Share.share({
        message: `Mi número de Crédito ${title} ${nameCurrency} en Compartamos Financiera es: ${accountNumber}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {}
  };

  const toastConfig = {
    info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: '#9a9a9a', 
        opacity: 0.9,
        borderRadius: 12,
        width: '65%',
        height: 48,
      }}
        text1Style={{height:0}}
        text2Style={{
          color: '#fff',
          fontSize: 15.25,
          fontWeight: 'bold',
        }}
    />
    )
  }

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text)
    Toast.show({
      type: 'info',
      text1: ' ',
      text2: 'Número de crédito copiado',
      position: 'bottom',
      visibilityTime: 2000,
    })
  }

  const styles = getStyles(detail);

  return (
    <View style={{backgroundColor: Colors.White, flex:1}}>
      <Svg 
        style={{alignSelf:'center'}}
        width="100%"
        height="191"
        viewBox="30 0 360 191"
        fill="none"
        xmlns="http://www.w3.org/3000/svg">
        <Path
          scaleX={1.17}
          d="M370.998 -9.99994V154.981C317.642 170.725 267.715 180.952 207.381 186.565C127.797 193.968 57.6709 191.27 0 184.583L5.45208e-06 -10L359.998 -9.99994Z" 
          fill="#CA005D"
        />
      </Svg>
      <View style={{width:'90%',alignSelf:'center',position:'absolute',top:'6%',zIndex:10,left:6}}>
        <View
          style={{
            flexDirection:'row',
            alignItems: 'center',
            marginLeft: '4%',
            marginBottom: detail ? '0%' : '-6%',
          }}
        >
          <TouchableOpacity onPress={action}>
            <Icon name='arrow-left' fill={Colors.Black} size='tiny' />
          </TouchableOpacity>
          <TextCustom
            style={{marginLeft: 8}}
            text={title}
            variation="p"
            color={Colors.White}
            weight='bold'
            size={35}
          />
          <Separator type='large' />
        </View>

        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'80%',marginLeft:6, marginTop: '8%'}}>
          <View style={styles.detailContainer}>
              <TextCustom 
              text={`Número de Crédito ${type}`}
              variation='small' 
              color={Colors.White}
              weight='bold'
              />
              <TextCustom 
              text={accountNumber}
              variation='small' 
              color={Colors.White}
              weight='bold'
              />
          </View>
          {accountNumber !== '' ? (
          <View style={{flexDirection:'row',marginRight:'-25%', marginBottom: '5%'}}>
              <TouchableOpacity onPress={() => {
                const nameCurrency = currency === 'S/' ? 'Soles' : 'Dólares'
                copyToClipboard(`Mi número de Crédito ${title} ${nameCurrency} en Compartamos Financiera es: ${accountNumber}`)}
              }>
                <Icon style={{marginRight:16}} name='copy' fill='#fff' size='x-small' />
              </TouchableOpacity>
              <TouchableOpacity onPress={onShare}>
                <Icon name='share' fill='#fff' size='x-small' />
              </TouchableOpacity>
          </View>
          ) : null}
        </View>
      </View>
      <View style={styles.detail}>
      {children}
      </View>
      <Toast config={toastConfig} />
    </View>
  )
}

const getStyles = (detail: boolean | undefined) => {
  const stylesBase = StyleSheet.create({
    container: {
      backgroundColor: Colors.White,
    },
    header: {
      backgroundColor: Colors.Primary,
      height: detail ? ScreenSize.height / 4 : ScreenSize.height / 6,
    },
    descriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '15%',
      marginLeft: '4%',
    },
    detailContainer: {
      marginLeft: '4%',
    },
    body: {
      marginTop: '4%',
      marginBottom: 12, 
      marginHorizontal: '6%',
      backgroundColor: Colors.White,
      height: '75%'
    },
    detail: {
      marginTop: '6%',
      backgroundColor: Colors.White,
      height:'95%',
      zIndex:-10
    }
  });

  return stylesBase;
};

export default DetailTemplate;

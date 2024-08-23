import React, { useEffect, useState } from 'react'
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Icon from '@atoms/Icon'
import Separator from '@atoms/Separator'
import TextCustom from '@atoms/TextCustom'
import DetailTemplate from '@templates/DetailTemplate'
import * as Progress from 'react-native-progress'
import { Colors } from '@theme/colors'
import Pill from '@atoms/Pill'
import { CreditDetailInterface } from '@services/Accounts'
import { getCreditDetail } from '@services/CreditLine';
import Skeleton from '@molecules/Skeleton'
import { GroupCreditDetailProps } from '@navigations/types'
import { useUserInfo } from '@hooks/common'

const Tooltip = () => {
  return (
    <View
      style={{
        position:'absolute',
        left: 0,
        top: 20,
        width: 240,
        height: 50,
        backgroundColor: '#83786F',
        opacity: 0.9,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextCustom
        text={'Incluye el monto de las cuotas vencidas, intereses compensatorios y moratorios al día de hoy.'}
        variation='p'
        color='#EFEFEF'
        size={11}
        weight='bold'
      />
    </View>
  )
}

const GroupCreditDetail = ({ navigation, route }: GroupCreditDetailProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showTooltip2, setShowTooltip2] = useState(false)

  const [creditDetail, setCreditDetail] = useState<CreditDetailInterface | null>(null)

  const {user} = useUserInfo();
  const person = user?.person;

  const getAccountDetail = async () => {
    const creditDetail = await getCreditDetail({
      accountCode: Number(route?.params?.accountNumber),
      user: `0${person?.documentTypeId}${person?.documentNumber}`,
      screen: route.name,
    })
    setCreditDetail(creditDetail)
  }

  useEffect(() => {
    getAccountDetail()
}, [])

  const deviceHeight = Dimensions.get('window').height

  useEffect(() => {
    setTimeout(() => {
      setShowTooltip(false)
    }, 3600);
  }, [showTooltip])

  useEffect(() => {
    setTimeout(() => {
      setShowTooltip2(false)
    }, 3600);
  }, [showTooltip2])
  
  return (
    <>
    <DetailTemplate 
      type={'Grupal'}
      currency={route.params.currency}
      title={route.params.productName}
      accountNumber={creditDetail?.groupAccountId}
      action={() => navigation.goBack()}>
      {creditDetail ?
      <>
      <View style={styles.detailsContainer}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View>
              <TextCustom text='Crédito Desembolsado' variation='p' weight='bold' size={14} />
              <TextCustom text={`${route.params.currency} ${creditDetail?.sgroupCapitalOriginal}`} variation='p' weight='bold' color={Colors.Primary} size={32} />
            </View>
            <View style={{justifyContent: 'center'}}>
              <TextCustom text='Saldo Capital' variation='p' weight='bold' size={14} />
              <TextCustom text={`${route.params.currency} ${creditDetail?.sgroupAmountBalanceCapital}`} variation='p' weight='bold' size={18} color={Colors.DarkGray} />
            </View>
          </View>
        <Separator type='small' />
        <Progress.Bar 
          style={{
            marginTop: 2,
            backgroundColor:route.params.capitalCanceledAmount > route.params.disbursedCapitalAmount ? '#FCCFCF' : Colors.GrayBackground,
            borderColor:route.params.capitalCanceledAmount > route.params.disbursedCapitalAmount ? '#FCCFCF' : Colors.GrayBackground,
          }}
            progress={route.params.advancePercentage}
            height={8}
            width={null}
            color={route.params.capitalCanceledAmount > route.params.disbursedCapitalAmount ? '#FCCFCF' : Colors.Secondary}
          />
      </View>

      <Separator type='medium' />

      <ScrollView 
        style={{marginBottom:'60%',zIndex:90}}
        contentContainerStyle={{height:deviceHeight<=684?Dimensions.get('screen').height-100:Dimensions.get('screen').height-270}}
        alwaysBounceHorizontal={false}
      >
        <View style={styles.detailsContainer}>
          <View style={[styles.detailContainer,{borderBottomWidth: 2, borderBottomColor: '#EFEFEF'}]}>
          <TextCustom weight='bold' text='Detalle de Grupo' variation='p' color={Colors.DarkGray} size={14} />
          </View>
          <View style={[styles.detailContainer,{marginTop:10}]}>
            <TextCustom weight='bold' text='Estado de la Cuota' variation='p' color={Colors.DarkGray} size={14} />
            <Pill title={creditDetail?.groupOverdueAmount !== 0 ? 'Vencido' : 'Al día'} />
          </View>
          <View style={styles.detailContainer}>
            <TextCustom weight='bold' text='Fecha de Vencimiento' variation='p' color={Colors.DarkGray} size={14} />
            <TextCustom weight='bold' text={creditDetail?.groupDateFirstInstallmentUnpaid} variation='p' color={Colors.DarkGray} size={14} />
          </View>
          <View style={styles.detailContainer}>
            <TextCustom weight='bold' text='Número de Cuota' variation='p' color={Colors.DarkGray} size={14} />
            <TextCustom weight='bold' text={`${creditDetail?.groupFeeNumber} de ${creditDetail?.groupTotalFeeNumber}`} variation='p' color={Colors.DarkGray} size={14} />
          </View>
          <View style={styles.detailContainer}>
            <TextCustom weight='bold' text='Cuota cronograma' variation='p' color={Colors.DarkGray} size={14} />
            <TextCustom weight='bold' text={`${route.params.currency} ${creditDetail?.sgroupInstallmentAmount}`} variation='p' color={Colors.DarkGray} size={14} />
          </View>
          {creditDetail?.groupOverdueAmount !== 0 && (
            <>
            <Separator type='small' showLine width={0.5} color='#EFEFEF' />
            <View style={styles.detailContainer}>
              <View style={{flexDirection: 'row',alignItems: 'center'}}>
                <TextCustom weight='bold' text='Deuda Vencida' variation='p' color={Colors.DarkGray} size=  {14} />
                <Pressable style={{position:'relative'}} onPress={() => setShowTooltip(true)}>
                  <Icon style={{marginLeft: 6}} name='info' size='tiny' fill='#000' />
                  {showTooltip && (
                    <View style={{zIndex:10}}>
                      <Tooltip />
                    </View>
                  )}
                </Pressable>
              </View>
              <TextCustom weight='bold' text={`${route.params.currency} ${creditDetail?.sgroupOverdueAmount}`}  color={Colors.DarkGray}  variation='p' size={14} />
            </View>
            </>
          )}
        </View>

        <Separator type='small' />

        <View style={[styles.detailsContainer,{zIndex:-10}]}>
          <View style={[styles.detailContainer,{borderBottomWidth: 2, borderBottomColor: '#EFEFEF'}]}>
          <TextCustom weight='bold' text='Detalle del Cliente' variation='p' color={Colors.DarkGray} size={14} />
          </View>
          <View style={[styles.detailContainer,{marginTop: 10}]}>
            <TextCustom weight='bold' text='Estado de la Cuota' variation='p' color={Colors.DarkGray} size={14} />
            <Pill title={creditDetail?.individualOverdueAmount !== 0 ? 'Vencido' : 'Al día'} />
          </View>
          <View style={styles.detailContainer}>
            <TextCustom weight='bold' text='Fecha de Vencimiento' variation='p' color={Colors.DarkGray} size={14} />
            <TextCustom weight='bold' text={creditDetail?.expirationDate} variation='p' color={Colors.DarkGray} size={14} />
          </View>
          <View style={styles.detailContainer}>
            <TextCustom weight='bold' text='Crédito Desembolsado' variation='p' color={Colors.DarkGray} size={14} />
            <TextCustom weight='bold' text={creditDetail?.sindividualCapitalOriginal}  variation='p' color={Colors.DarkGray} size={14} />
          </View>
          <View style={styles.detailContainer}>
            <TextCustom weight='bold' text='Cuota cronograma' variation='p' color={Colors.DarkGray} size={14} />
            <TextCustom weight='bold' text={`${route.params.currency} ${creditDetail?.sindividualInstallmentAmount}`}  variation='p' color={Colors.DarkGray} size={14} />
          </View>

          {creditDetail?.individualOverdueAmount !== 0 && (
            <>
            <Separator type='small' showLine width={0.5} color='#EFEFEF' />

            <View style={styles.detailContainer}>
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                  <TextCustom weight='bold' text='Deuda Vencida' variation='p' color={Colors.DarkGray} size=  {14} />
                  <Pressable style={{position:'relative'}} onPress={() => setShowTooltip2(true)}>
                    <Icon style={{marginLeft: 6}} name='info' size='tiny' fill='#000' />
                    {showTooltip2 && (
                      <View style={{zIndex:10}}>
                        <Tooltip />
                      </View>
                    )}
                  </Pressable>
                </View>
                <TextCustom weight='bold' text={`${route.params.currency} ${creditDetail?.sindividualOverdueAmount}`} color={Colors.DarkGray}  variation='p' size={14} />
            </View>
            </>
          )}

        </View>
      </ScrollView>
      </>
      :
      <Skeleton timing={600}>
        <View style={{marginTop:24,marginLeft:16,width:'90%',height:60,borderRadius:8,backgroundColor:'#E1E1E1'}} />
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
      </Skeleton>}
    </DetailTemplate>
    </>
  )
}

const styles = StyleSheet.create({
  detailsContainer: {
    alignSelf: 'center',
    borderRadius: 12,
    padding: 18,
    backgroundColor: '#f9f9f9',
    width: '90%'
  },
  detailContainer: {
    paddingVertical: 6,
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  skeleton: {
    marginTop:24,
    marginLeft:16,
    width:'90%',
    height:100,
    borderRadius:8,
    backgroundColor:'#E1E1E1',
  },
})

export default GroupCreditDetail

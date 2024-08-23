import React from 'react'
import PopUp from "@atoms/PopUp"
import Separator from "@atoms/Separator"
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from '@atoms/Icon'
import { Colors } from '@theme/colors'
import {FontSizes, FontTypes} from '@theme/fonts';

interface ModalErrors {
    isOpen: boolean
    title: string
    content: string
    close?: () => void
    keepScreen?: () => void
    changeTransfer?: () => void
    errorCode?: string
    titleButton?: string
    loading?: boolean
  }

const ModalError = ({isOpen,title,content,close,errorCode,titleButton,keepScreen,changeTransfer,loading}: ModalErrors) => {
    return (
        <PopUp animationOutTiming={1} open={isOpen}>
            {errorCode === '-1' && (
                <>
                <TouchableOpacity
                    style={{width:'100%',alignItems:'flex-end',marginTop:-24}}
                    onPress={close}
                >
                    <Icon name='close-small' size='small' fill='#000' />
                </TouchableOpacity>
                <View style={{height: 200,justifyContent: 'center'}}>
                    <Image style={{height:150,width:150}} source={require('@assets/images/upsWoman.png')} />
                </View>
                </>
            )}
            {errorCode === 'activeChannel' && (
                <View style={{height: 200,justifyContent: 'center',marginBottom:12}}>
                    <Image style={{height:180,width:170}} source={require('@assets/images/repairMan.png')} />
                </View>
            )}
            {errorCode === 'offline' && (
                <View style={{height: 90,justifyContent: 'center',marginBottom:12}}>
                    <Image style={{height:120,width:120}} source={require('@assets/images/offline.png')} />
                </View>
            )}
            <Separator type="small" />
            <Text
            style={{
                fontSize: 18,
                color: "#665F59",
                textAlign: 'center',
                fontFamily: FontTypes.Bree,
                zIndex: 0,
            }}
            >
                {title}
            </Text>
            <Separator type="small" />
            <Text
            style={{
                fontSize: 18,
                color: "#83786F",
                textAlign: 'center',
                fontFamily:FontTypes.AmorSansPro,
                zIndex: 0,
            }}
            >
                {content}
            </Text>
            <Separator size={24} />
            {errorCode !== 'activeChannel' ? 
            <Pressable
                onPress={errorCode === '450' || errorCode === '406' ? changeTransfer : close}
                style={({pressed}) => ({
                    ...getStyles(
                        pressed,
                      ).container,
                })}
            >
            {({pressed}) => {
                const styles = getStyles(
                    pressed,
                )
                return (
                <Text style={styles.text}>
                {errorCode === '450' || errorCode === '406' ?
                'Cambiar tipo de Transferencia'
                :
                titleButton || (errorCode === '-1' ? 'Volver a inicio' : ((errorCode == '498' || errorCode == '499') ? 'Entiendo' : 'Volver a intentar'))
                }
                </Text>
                )
            }}
            </Pressable>
            : null}
            <Separator size={12} />
            {errorCode === '450' ?
            <TouchableOpacity onPress={keepScreen}>
                <Text style={{
                    textDecorationLine: 'underline',
                    fontSize: 14,
                    color: Colors.DarkGray
                }}>
                        Quedarme aquí
                </Text>
            </TouchableOpacity>
            : null}
        </PopUp>
    )
}

const getStyles = (
    pressed: boolean,
) => {
    const stylesBase = StyleSheet.create({
        container: {
            borderRadius: 5,
            paddingVertical: 8 * 2,
            paddingHorizontal: 8 * 2,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 8 * 6.5,
            width: '100%',
            backgroundColor: pressed ? Colors.PrimaryHover : Colors.Primary
          },
          text: {
            fontFamily: FontTypes.BreeBold,
            fontSize: FontSizes.Button,
            color: Colors.White,
          },
    })

    return {
        ...stylesBase,
      };
}

export default ModalError
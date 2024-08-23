import React from 'react'
import { View } from 'react-native'
import TextCustom from '@atoms/TextCustom'

const Pill = ({ title }: {title: string}) => {
    const pillColor = title === 'Vencido' ? '#FCCFCF' : '#CEF1BB'
    const dotColor = title === 'Vencido' ? '#EB4141' : '#2AA620'
    return (
      <View
        style={{
          width: '25%',
          backgroundColor: pillColor,
          padding: 4,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: -6
        }}
      >
        <View style={{borderColor: dotColor,borderWidth:4,height:2,borderRadius:50}} />
        <TextCustom text={title} weight='bold' variation='p' color={dotColor} size={15} />
      </View>
    )
  }

  export default Pill
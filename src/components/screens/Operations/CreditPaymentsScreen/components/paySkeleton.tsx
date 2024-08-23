import Skeleton from '@molecules/Skeleton';
import React from 'react'
import { View } from 'react-native'

interface IProps {
  height?: number,
  amount?: number
}

export const PaySkeleton = ({ height = 80, amount = 1}: IProps) => {
  const amountSkeleton = Array(amount).fill(1);
  return (
    <>
      {
        amountSkeleton.map( (_, index) => {
          return (
            <Skeleton timing={600} key={index}>
              <View
                style={{
                    height: height,
                    borderRadius: 8,
                    backgroundColor: '#E1E1E1',
                    marginBottom: (amount > 1) ? 24 : 0
                }}
              />
            </Skeleton>
          )
        } )
      } 
    </>
  )
}
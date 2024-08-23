/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import Skeleton from '@molecules/Skeleton';

const HEIGHT_LOW = 12;
const HEIGHT_HIGH = 28;

export const LoadingContent = () => {
  return (
    <Skeleton timing={600} style={{flex: 1}}>
      <BoxView
        background="neutral-light"
        style={{width: '60%', height: HEIGHT_HIGH}}
      />
      <Separator type="small" />
      <BoxView direction="row" justify="space-between">
        <BoxView
          background="neutral-light"
          style={{width: '35%', height: HEIGHT_HIGH}}
        />
        <View style={{width: '60%', height: HEIGHT_HIGH}}>
          <BoxView
            background="neutral-light"
            style={{width: '100%', height: HEIGHT_LOW}}
          />
          <Separator type="xx-small" />
          <BoxView
            background="neutral-light"
            style={{width: '100%', height: HEIGHT_LOW}}
          />
        </View>
      </BoxView>

      <Separator type="large" />

      <BoxView
        background="neutral-light"
        style={{width: '60%', height: HEIGHT_HIGH}}
      />
      <Separator type="small" />
      <BoxView direction="row" justify="space-between">
        <BoxView
          background="neutral-light"
          style={{width: '35%', height: HEIGHT_HIGH}}
        />
        <View style={{width: '60%', height: HEIGHT_HIGH}}>
          <BoxView
            background="neutral-light"
            style={{width: '100%', height: HEIGHT_LOW}}
          />
          <Separator type="xx-small" />
          <BoxView
            background="neutral-light"
            style={{width: '100%', height: HEIGHT_LOW}}
          />
        </View>
      </BoxView>
    </Skeleton>
  );
};

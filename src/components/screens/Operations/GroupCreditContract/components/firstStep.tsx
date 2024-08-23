import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import BoxView from '@atoms/BoxView';
import {SIZES} from '@theme/metrics';
import {FlatList, ScrollView} from 'react-native';
import {indexStyles as styles} from '../styles';
import {IParticipant} from '@interface/Credit';
import {useUserInfo} from '@hooks/common';

const hideText = (text: string, size: number) => {
  if (text.length <= size) return text;
  const hidedText = text.substring(0, size - 3) + '...';
  return hidedText;
};

const ItemList = ({item}: {item: IParticipant}) => {
  return (
    <BoxView direction="row" py={SIZES.MD} justify="space-between">
      <BoxView justify="center">
        <TextCustom
          color="neutral-darkest"
          variation="h4"
          weight="normal"
          lineHeight="tight"
          text={hideText(item.nameParticipant, 25)}
        />
        {item.hasInsurance && (
          <>
            <Separator type="xx-small" />
            <TextCustom
              color="neutral-dark"
              variation="h6"
              weight="normal"
              lineHeight="tight"
              text="Incluye Seguro Protección"
            />
          </>
        )}
      </BoxView>

      <BoxView>
        <TextCustom
          color="neutral-darkest"
          variation="h4"
          weight="normal"
          lineHeight="tight"
          size={10}
          text="Crédito solicitado"
        />
        <Separator type="xx-small" />
        <TextCustom
          color="primary-dark"
          variation="h4"
          weight="normal"
          lineHeight="tight"
          text={item.sAmountApproved}
        />
      </BoxView>
    </BoxView>
  );
};

export const FirstStep = () => {
  const {userGroupCreditToDisburt: groupCredit} = useUserInfo();
  return (
    <>
      <TextCustom
        color="neutral-darkest"
        variation="h4"
        weight="normal"
        lineHeight="tight"
        text="Grupo"
      />
      <Separator type="xx-small" />
      <TextCustom
        color="neutral-darkest"
        variation="h3"
        weight="normal"
        lineHeight="tight"
        text={groupCredit?.groupName}
      />

      <Separator type="small" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        horizontal
        scrollEnabled={false}>
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={groupCredit?.participant}
          renderItem={ItemList}
          keyExtractor={item => item.clientCode}
        />
      </ScrollView>
    </>
  );
};

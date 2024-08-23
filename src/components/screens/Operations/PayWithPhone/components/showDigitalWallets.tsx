import React from 'react';
import TextCustom from '@atoms/extra/TextCustom';
import Separator from '@atoms/extra/Separator';
import ButtonCard from '@molecules/extra/ButtonCard';
import {DestinationListInterface} from '@services/Interoperability';
import BoxView from '@atoms/BoxView';
import {LoadingBasic} from '@molecules/extra/LoadingBasic';
import {UserContact} from './contactItem';

interface Props {
  destinationList: DestinationListInterface[];
  getContactInfo: any;
  contactSelected: UserContact | undefined;
  isDisabled: boolean;
}

export const ShowDigitalWallets = ({
  destinationList,
  getContactInfo,
  contactSelected,
  isDisabled,
}: Props) => {
  const phoneNumber =
    typeof contactSelected === 'string'
      ? contactSelected
      : contactSelected?.phoneNumber;

  return (
    <>
      <Separator type="large" />
      <TextCustom
        text="Elige un destino"
        variation="h4"
        weight="normal"
        color="neutral-darkest"
      />
      {!isDisabled ? (
        destinationList.map((wallet, index) => (
          <BoxView key={wallet.bankCode + index}>
            <Separator type="x-small" />
            <ButtonCard
              text={wallet.destinationName ?? ''}
              isDisabled={isDisabled}
              onChange={() =>
                getContactInfo(
                  wallet.bankCode,
                  wallet.destinationName,
                  phoneNumber,
                )
              }
            />
          </BoxView>
        ))
      ) : (
        <LoadingBasic />
      )}
      <Separator type="medium" />
    </>
  );
};

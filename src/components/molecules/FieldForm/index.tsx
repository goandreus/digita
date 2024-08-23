import React, {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';
import FieldMessage, {FieldMessageType} from '@atoms/FieldMessage';
import Separator from '@atoms/Separator';

interface FieldFormProps {
  children?: ReactNode;
  message?: string;
  messageType?: FieldMessageType;
  showMessage?: boolean;
  style?: ViewStyle;
}

const FieldForm = ({
  children,
  message,
  messageType,
  showMessage: _showMessage = false,
  style,
}: FieldFormProps) => {
  const showMessage = message && messageType && _showMessage;

  return (
    <View style={style}>
      {children}
      {showMessage && (
        <>
          <Separator type="x-small" />
          <FieldMessage text={message} type={messageType} />
        </>
      )}
    </View>
  );
};

export default FieldForm;

import React, {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';
import FieldMessage, {FieldMessageType} from '@atoms/extra/FieldMessage';
import Separator from '@atoms/extra/Separator';

interface FieldFormProps {
  children?: ReactNode;
  message?: string;
  messageType?: FieldMessageType;
  showMessage?: boolean;
  style?: ViewStyle;
  hideIconLeft?: boolean;
}

const FieldForm = ({
  children,
  message,
  messageType,
  showMessage: _showMessage = false,
  style,
  hideIconLeft,
}: FieldFormProps) => {
  const showMessage = message && messageType && _showMessage;

  return (
    <View style={style}>
      {children}
      {showMessage && (
        <>
          <Separator type="x-small" />
          <FieldMessage
            hideIconLeft={hideIconLeft}
            text={message}
            type={messageType}
          />
        </>
      )}
    </View>
  );
};

export default FieldForm;

import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

interface TruncatedTextProps {
  installmentsText: string | undefined;
  amountInstallmentsText: string | undefined;
  maxLength: number;
  style: StyleProp<TextStyle>;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  installmentsText,
  amountInstallmentsText,
  maxLength,
  style,
}) => {
  const text = `${installmentsText} de ${amountInstallmentsText}`
  if (text.length <= maxLength) {
    return <Text style={style}>{text}</Text>;
  }

  const finalText = `${installmentsText?.slice(0, 10)}...${installmentsText?.slice(-4)} de ${amountInstallmentsText}`;

  return <Text style={style}>{finalText}</Text>;
};

export default TruncatedText;

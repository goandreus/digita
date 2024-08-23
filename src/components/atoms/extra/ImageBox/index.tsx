import {COLORS} from '@theme/colors';
import {SIZES} from '@theme/metrics';
import React from 'react';
import {View, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import Separator from '../Separator';

interface ImageBoxProps {
  images: {
    source: ImageSourcePropType;
    width: number;
    height: number;
    id: string;
  }[];
}

const ImageBox = ({images}: ImageBoxProps) => {
  const styles = getStyles();

  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <React.Fragment key={image.id}>
          <Image
            source={image.source}
            style={{...styles.image, aspectRatio: image.width / image.height}}
          />
          {index !== images.length - 1 && <Separator type="small" />}
        </React.Fragment>
      ))}
    </View>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: COLORS.Background.Light,
      borderColor: COLORS.Background.Light,
      borderWidth: 1,
      padding: SIZES.XS * 2,
      borderRadius: 5,
    },
    image: {
      borderRadius: 5,
    },
  });
  return styles;
};

export default ImageBox;

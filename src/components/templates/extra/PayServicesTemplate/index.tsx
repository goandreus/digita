import {
    StatusBar,
    Keyboard,
    TouchableWithoutFeedback,
    StyleSheet,
    View,
} from 'react-native';
import React from 'react';
import { COLORS } from '@theme/colors';
import BoxView from '@atoms/BoxView';
import { SIZES } from '@theme/metrics';
import { HeaderStack } from '@molecules/extra/HeaderStack';

interface Props {
    headerTitle: string;
    children?: React.ReactNode;
    canGoBack: boolean;
    goBack: () => void;
}

const PayServicesTemplate = ({
    headerTitle,
    children,
    canGoBack,
    goBack,
}: Props) => {
    return (
        <>
            <StatusBar
                translucent={true}
                barStyle="dark-content"
                backgroundColor={COLORS.Background.Lightest}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <BoxView flex={1} style={{ backgroundColor: COLORS.Background.Light }}>
                    <BoxView style={styles.headerBorder}>
                        <HeaderStack
                            canGoBack={canGoBack}
                            onBack={goBack}
                            title={headerTitle}
                        />
                    </BoxView>
                    <View style={{
                        flexDirection: 'column',
                        flex: 1,
                        marginTop: 8
                    }}>
                        {children}
                    </View>
                </BoxView>
            </TouchableWithoutFeedback>
        </>
    );
};

const styles = StyleSheet.create({
    headerBorder: {
        borderTopWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.01)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 12,
    },
});

export default PayServicesTemplate;

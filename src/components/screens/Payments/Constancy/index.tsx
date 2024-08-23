import React, { useLayoutEffect, useRef, useState } from 'react'
import { StatusBar, View } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '@theme/colors';
import _ from 'lodash';
import MainContent from './MainContent';
import { PayConstancyScreenProps } from '@navigations/types';

const PayConstancy = ({ navigation, route }: PayConstancyScreenProps) => {
    const [showFireworks, setShowFireworks] = useState<boolean>(false);
    const screenshotRef = useRef<View | null>(null);
    const { stage, ...payload } = route.params;
    const [isOpen, setIsOpen] = useState(false);

    useLayoutEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', e => {
            if (e.data.action.type === 'GO_BACK') e.preventDefault();
        });
        return () => unsubscribe();
    }, [navigation]);
    return (
        <View
            onLayout={() => {
                setIsOpen(true);
            }}
            style={{
                backgroundColor: COLORS.Primary.Medium,
                flex: 1,
            }}
        >
            <StatusBar
                    barStyle="light-content"
                    backgroundColor={COLORS.Transparent}
                    translucent={true}
                />
            <Modal
                coverScreen={false}
                backdropTransitionOutTiming={0}
                onBackdropPress={() => { }}
                animationInTiming={600}
                onModalShow={() => setShowFireworks(true)}
                onModalHide={() => setShowFireworks(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                hasBackdrop={false}
                statusBarTranslucent={true}
                isVisible={isOpen}
                useNativeDriver={true}
                style={{
                    margin: 0,
                    backgroundColor: 'white',
                }}
            >
                <MainContent
                    screenshotRef={screenshotRef}
                    mode='NORMAL'
                    stage={stage}
                    showFireworks={showFireworks}
                    payload={payload}
                />

            </Modal>
            <MainContent
                stage={stage}
                ref={screenshotRef}
                mode='SCREENSHOT'
                payload={payload}
            />
        </View>
    );
}

export { PayConstancy };

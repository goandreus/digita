import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useAppDispatch } from '@hooks/useAppDispatch';
import { update } from '@features/activity';
import NetInfo from '@react-native-community/netinfo';
import { useAppSelector } from '@hooks/useAppSelector';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useUserInfo } from '@hooks/common';
import { SessionManager } from '@managers/SessionManager';

interface Props {
    children: React.ReactNode;
    navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
}

const ActivityHandler = (props: Props) => {
    const dispatch = useAppDispatch();
    const activity = useAppSelector(state => state.activity);
    const { user } = useUserInfo();
    const isUserLogged = user !== null;
    const [isIdle, setIsIdle] = useState<boolean>(false);
    const [isNetworkOffline, setIsNetworkOffline] = useState<boolean>(false);
    const [touchedAt, setTouchedAt] = useState<Date>(new Date());

    useEffect(() => {
        setIsIdle(false);
        const id = setTimeout(() => {
            setIsIdle(true);
        }, 1000 * 60 * 5);

        return () => clearTimeout(id);
    }, [touchedAt]);

    useEffect(() => {
        dispatch(update({ isIdle: isIdle }));
    }, [isIdle]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(networkState => {
            const offline = !networkState.isConnected;
            setIsNetworkOffline(offline);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        dispatch(update({ isNetworkOffline: isNetworkOffline }));
    }, [isNetworkOffline]);

    useEffect(() => {
        if (isUserLogged && (
            activity.isIdle ||
            activity.isNetworkOffline ||
            activity.isTokenExpired
        )) {
            setTimeout(() => {
                props.navigationRef.reset({
                    index: 0,
                    routes: [{
                        'name': 'ModalInactivity'
                    }]
                });
            });
        }
    }, [activity, isUserLogged]);

    useEffect(() => {
        SessionManager
            .getInstance()
            .onError(() => {
                dispatch(update({ isTokenExpired: true }));
            });
    }, []);
    return (
        <View
            style={{ flex: 1 }}
            onTouchStart={() => {
                setTouchedAt(new Date());
            }}>
            {props.children}
        </View>
    );
}

export { ActivityHandler }
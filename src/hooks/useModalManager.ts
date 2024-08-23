import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactNativeModal from 'react-native-modal';

export const useModalManager = (modalIds: string[]) => {
    const [current, setCurrent] = useState<string | undefined>(undefined);
    const [next, setNext] = useState<string | undefined>(undefined);
    const refs = useRef<ReactNativeModal[]>([]);
    const callbacks = useRef<(() => void)[]>([]);

    const isAnyModalOpened = useCallback(() => {
        let opened = false;
        for (let index = 0; index < refs.current.length; index++) {
            const element = refs.current[index];
            if (element.state.isVisible) {
                opened = true;
                break;
            }
        }
        return opened;
    }, []);

    const open = useCallback((modalId: string) => {
        setNext(modalId);
    }, []);

    const handleRef = useCallback((ref: ReactNativeModal | null) => {
        if (ref === null) return;
        refs.current.push(ref);
    }, []);

    const close = useCallback((callback: (() => void) | undefined = undefined) => {
        setNext(undefined);
        if (typeof callback === 'function') callbacks.current.push(callback);
    }, []);

    useEffect(() => {
        let isFinished = false;
        setCurrent(undefined);
        const id = setInterval(() => {
            if(isAnyModalOpened() === false){
                isFinished = true;
                setCurrent(next);
                while (callbacks.current.length) {
                    let cb = callbacks.current.shift();
                    if (cb !== undefined) cb();
                }
                clearInterval(id);
            }
        });
        const guardId = setTimeout(() => {
            if (isFinished === false) console.error("[!] Modal no se puede cerrar. Verifica la referencia.");
            clearInterval(id);
            clearTimeout(guardId);
        }, 5000);
        return () => {
            clearInterval(id);
            clearTimeout(guardId);
        };
    }, [next, isAnyModalOpened]);

    return {
        current,
        handlers: {
            handleRef,
        },
        actions: {
            open,
            close
        }
    };
};
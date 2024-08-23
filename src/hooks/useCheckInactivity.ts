import {PanResponder} from 'react-native';
import {useCallback, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

interface Props {
  ms?: number;
  onEndInactivity?: () => void;
  route?: string;
}

const useCheckInactivity = ({
  ms = 1000 * 300,
  onEndInactivity,
  route,
}: Props) => {
  const [start, setStart] = useState(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimeout = useCallback(() => {
    if (start) {
      clearTimeout(timerId.current);
      timerId.current = setTimeout(() => onEndInactivity?.(), ms);
    }
  }, [start]);

  useFocusEffect(
    useCallback(() => {
      if (route === 'MainTab') {
        setStart(true);
        resetInactivityTimeout();
      }

      return () => {
        console.log('NOT_CHECK');
        setStart(false);
      };
    }, [start]),
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
        return false;
      },
    }),
  ).current;

  return {panResponder, resetInactivityTimeout};
};

export default useCheckInactivity;

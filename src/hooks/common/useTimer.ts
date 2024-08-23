import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {restart as restartTimer, TimerState} from '@features/timer/timerSlice';

interface ITimerHook {
  timers: TimerState[];
  restart: (payload: {documentNumber: string; documentType: number}) => void;
  selectTimer: ({
    documentNumber,
    documentType,
  }: {
    documentNumber: string;
    documentType: number;
  }) => TimerState | undefined;
}

export const useTimer = (): ITimerHook => {
  const timers = useAppSelector(state => state.timer);
  const dispatch = useAppDispatch();

  const selectTimer = ({
    documentNumber,
    documentType,
  }: {
    documentNumber: string;
    documentType: number;
  }) =>
    timers.find(
      item =>
        item.documentType === documentType &&
        item.documentNumber === documentNumber,
    );

  const restart = (payload: {documentNumber: string; documentType: number}) =>
    dispatch(restartTimer(payload));

  return {
    timers,
    selectTimer,
    restart,
  };
};

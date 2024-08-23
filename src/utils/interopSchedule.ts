import {getRemoteValue} from '@utils/firebase';

export const interopSchedule = () => {
  const active_interop = getRemoteValue('active_interop').asString();
  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();
  const currentMoment =
    currentMinutes < 10
      ? +`${currentHour}${currentMinutes}0`
      : +`${currentHour}${currentMinutes}`;
  const scheduleRange = active_interop?.split('-');
  const [startRange, endRange] = scheduleRange;

  const startHour = +startRange?.slice(0, startRange?.length - 2);
  const endHour =
    +endRange < 1300
      ? +endRange?.slice(0, endRange?.length - 2)
      : +endRange?.slice(0, endRange?.length - 2) - 12;
  const startMinutes = +startRange?.slice(-2);
  const endMinutes = +endRange?.slice(-2);

  const startHourText = startHour < 10 ? `0${startHour}` : `${startHour}`;
  const endHourText = endHour < 10 ? `0${endHour}` : `${endHour}`;
  const startMinutesText =
    startMinutes < 10 ? `0${startMinutes}` : `${startMinutes}`;
  const endMinutesText = endMinutes < 10 ? `0${endMinutes}` : `${endMinutes}`;
  const startLabel = startHour < 13 ? 'am' : 'pm';
  const endLabel = +endRange < 1300 ? 'am' : 'pm';

  return {
    visibilityModal: currentMoment < +startRange || currentMoment > +endRange,
    startHour: ` ${startHourText}:${startMinutesText} ${startLabel} `,
    endHour: ` ${endHourText}:${endMinutesText} ${endLabel}.`,
  };
};

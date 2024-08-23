export const getSchedulesTextFormat = (
  message: string,
): {schedules: string[] | null; content: string[]} => {
  const scheduleRegex = /(\d{1,2}:\d{2} [ap]m)|(Domingos)|(feriados)/g;
  const schedulesFounded = message.match(scheduleRegex);
  const textWithoutSchedules = message.split(scheduleRegex);
  if (schedulesFounded && schedulesFounded.length > 0) {
    return {schedules: schedulesFounded, content: textWithoutSchedules};
  }
  return {schedules: null, content: textWithoutSchedules};
};

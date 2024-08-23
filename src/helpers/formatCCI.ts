export const formatCCI = (cci: string) => {
  const firstGroup = cci.substr(0, 3);
  const secondGroup = cci.substr(3, 3);
  const thirdGroup = cci.substr(6, 12);
  const fourthGroup = cci.substr(18, 2);

  return `${firstGroup} ${secondGroup} ${thirdGroup} ${fourthGroup}`;
};

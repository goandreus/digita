import {useMemo} from 'react';
import {useUserInfo} from './common';

interface Props {
  operationUId: number;
}

const useAccountByOperationUid = ({operationUId}: Props) => {
  const {userSavings} = useUserInfo();
  const originAccount = useMemo(() => {
    return [
      ...(userSavings?.savings.savings ?? []),
      ...(userSavings?.compensations.savings ?? []),
    ].find(accs => accs.operationUId === operationUId);
  }, [
    operationUId,
    userSavings && userSavings?.savings.savings,
    userSavings && userSavings?.compensations.savings,
  ]);

  return originAccount ?? null;
};

export default useAccountByOperationUid;

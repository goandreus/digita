import {useLineSimulationContext} from '../context';
import {useUserInfo} from '@hooks/common';
import {LineSimulationProps} from '@navigations/types';
import {useNavigation} from '@react-navigation/native';
import {
  CreateRequestLineCredit,
  SimulatorLineCredit,
} from '@services/CreditLine';
import {useEffect, useRef} from 'react';

export const useLineSimulation = () => {
  const route = useNavigation<LineSimulationProps['route']>();
  const {
    amountValue,
    payDay,
    selectedQuota,
    limits,
    simulationData,
    setSimulationData,
    setShowModal,
    setLoading,
    updateModal,
    goDisbursment,
  } = useLineSimulationContext();
  const timerRef = useRef<any>(null);

  const {user} = useUserInfo();

  const btnDisabled =
    !payDay ||
    (selectedQuota !== null
      ? selectedQuota < limits.minQuota || selectedQuota > limits.maxQuota
      : true) ||
    (amountValue
      ? amountValue < limits.minAmount || amountValue > limits.maxAmount
      : true);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        requiredAmount: amountValue!,
        requiredTerms: selectedQuota!,
        paymentDay: Number(payDay?.value),
      };

      const res = await SimulatorLineCredit({
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route.name,
        payload,
      });

      if (res?.isSuccess && res.data) {
        const data = res?.data;
        setSimulationData(data);
        setShowModal(true);
      } else if (!res?.isSuccess && res?.data?.title) {
        updateModal({
          show: true,
          title: res.data.title,
          content: res.data.message,
          btnText: 'Entendido',
          onClose: () => updateModal({show: false}),
        });
      } else {
        updateModal({
          show: true,
          title: '¡Uy, ocurrió un problema!',
          content:
            'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
          btnText: 'Entendido',
          onClose: () => updateModal({show: false, errors: undefined}),
        });
      }
    } catch (error) {
      updateModal({
        show: true,
        title: '¡Uy, ocurrió un problema!',
        content:
          'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
        btnText: 'Entendido',
        onClose: () => updateModal({show: false, errors: undefined}),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoDisbursement = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      const payload = {
        amount: amountValue!,
        terms: selectedQuota!,
        paymentDay: Number(payDay?.value),
        tem: simulationData?.tem ?? 0,
      };

      const res = await CreateRequestLineCredit({
        documentType: user?.person.documentTypeId,
        documentNumber: user?.person.documentNumber,
        screen: route.name,
        payload,
      });

      if (res?.isSuccess && res.data) {
        const data = res?.data;
        goDisbursment(data);
      } else if (!res?.isSuccess && res?.data?.title) {
        const {content, title, messageButton, MessageBRMS} = res.data as any;
        updateModal({
          show: true,
          title: title,
          content: content,
          btnText: messageButton ?? 'Entendido',
          errors: MessageBRMS ?? undefined,
          onClose: () => updateModal({show: false, errors: undefined}),
        });
      } else {
        updateModal({
          show: true,
          title: '¡Uy, ocurrió un problema!',
          content:
            'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
          btnText: 'Entendido',
          onClose: () => updateModal({show: false, errors: undefined}),
        });
      }
    } catch (error) {
      updateModal({
        show: true,
        title: '¡Uy, ocurrió un problema!',
        content:
          'Por favor vuelve a intentarlo una vez más. Si el problema continúa te recomendamos intentarlo en unos minutos.',
        btnText: 'Entendido',
        onClose: () => updateModal({show: false, errors: undefined}),
      });
    } finally {
      timerRef.current = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // Clear the interval when the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    btnDisabled,
    handleSubmit,
    handleGoDisbursement,
  };
};

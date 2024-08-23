// @ts-ignore
import OTPClient from 'otp-client';
import {useEffect, useState} from 'react';

interface OTP {
  getToken: () => number;
  getTimeUntilNextTick: () => number;
}

interface OTPState {
  currentToken?: number | null;
  timeUntilNextToken?: number | null;
}

interface OTPOptions {
  digits?: number;
  period?: number;
  secretKey: string;
  algorithm?: string;
}

const createOTPStore = () => {
  let otp: OTP | null = null;
  let timer: NodeJS.Timer | null = null;
  const listeners = new Set<(data: OTPState) => void>();

  return {
    isInitialized: () => otp !== null,
    getOtpState: (): OTPState => ({
      currentToken: otp?.getToken(),
      timeUntilNextToken: otp?.getTimeUntilNextTick(),
    }),
    clearOtp: () => {
      if (timer) clearInterval(timer);
      otp = null;
      timer = null;
      for (const cb of listeners) {
        cb({currentToken: null, timeUntilNextToken: null});
      }
    },
    startOtp: ({secretKey, ...options}: OTPOptions) => {
      if (timer) clearInterval(timer);
      otp = new OTPClient(secretKey, options);
      timer = setInterval(() => {
        for (const cb of listeners) {
          cb({
            currentToken: otp?.getToken(),
            timeUntilNextToken: otp?.getTimeUntilNextTick(),
          });
        }
      }, 1000);
    },
    subscribe: (cb: (data: OTPState) => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
};

export const storeOTP = createOTPStore();

const defaultCallback = (state: OTPState) => state;
function useStoreOTP<T>(cb: (state: OTPState) => T): T;
function useStoreOTP(): ReturnType<typeof defaultCallback>;

function useStoreOTP(selector = defaultCallback) {
  const [state, setState] = useState(() => selector(storeOTP.getOtpState()));

  useEffect(() => {
    const remove = storeOTP.subscribe(data => setState(selector(data)));

    return () => {
      remove();
    };
  }, []);

  return state;
}

export default useStoreOTP;

// Uso
/*
const {currentToken, timeUntilNextToken} = useStoreOTP();
const token = useStoreOTP(state => state.currentToken);
const time = useStoreOTP(state => state.timeUntilNextToken);
*/

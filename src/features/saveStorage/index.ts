import {storage} from '@utils/secure-storage';

type Reg = Record<string, boolean>;

const KEY = '@viewInteroperabilityModal';
const getRegs = () => storage.getString(KEY);

export default {
  removeAll: () => storage.set(KEY, JSON.stringify({})),
  getAll: () => {
    const rawString = getRegs();
    return rawString ? (JSON.parse(rawString) as Reg) : {};
  },
  has: (dni: string) => {
    const rawString = getRegs();
    const allDnis = rawString ? (JSON.parse(rawString) as Reg) : {};

    if (Object.keys(allDnis).length === 0) return false;
    return allDnis[dni.trim()];
  },
  add: (dni: string) => {
    const rawString = getRegs();
    const oldDnis = rawString ? (JSON.parse(rawString) as Reg) : {};
    const newDnis = {...oldDnis, [dni.trim()]: true};
    storage.set(KEY, JSON.stringify(newDnis));
    return true;
  },
};

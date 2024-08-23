import { init, track as _track, Types, setUserId } from '@amplitude/analytics-react-native';
import { AMPLITUDE_API_KEY } from '@constants';
import { flatten, unflatten } from 'flat';

export class AH {
    private static instance?: AH;
    private static stack: any[] = [];

    private constructor() {
        init(AMPLITUDE_API_KEY as string);
    }

    public static async start() {
        if (!AH.instance) {
            //AH.instance = new AH();
        }
    }

    public static async identifyUser(identifier: string) {
        try {
            if (AH.instance === undefined) throw Error("Amplitude instance isn't exist.");
            //setUserId(identifier);
        } catch (error) {
        }
    }

    public static async pushPayload(payload: object) {
        this.stack.push(flatten(payload));
        if (this.stack.length > 30) this.stack.shift();
    }

    private static getValues(key: string) {
        let result: any[] = [];
        for (let index = this.stack.length - 1; index >= 0; index--) {
            const obj = this.stack[index];
            const keys = Object.keys(obj);
            for (let index = 0; index < keys.length; index++) {
                const _key = keys[index];
                if (_key.includes(key)) {
                    result.push(obj[_key]);
                }
            }
        }
        return result;
    }

    public static autoGenerate(key: string) {
        return `AHKEY-${key}`;
    }

    public static async track(eventInput: Types.BaseEvent | string, eventProperties?: Record<string, any>, eventOptions?: Types.EventOptions) {
        try {
            let obj = flatten(eventProperties) as any;
            const keys = Object.keys(obj);
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const value = obj[key];
                if (typeof value === 'string' && value.includes("AHKEY")) {
                    const chunks = value.split("-");
                    const values = this.getValues(chunks[1]);
                    obj[key] = values[0];
                }
            }
            obj = unflatten(obj);
            this.pushPayload(obj);
            if (eventInput === 'CF App - Vista Activa' && obj["Nombre de la Vista"] === 'Vista Desconocida') return;
            //_track(eventInput, obj);
        } catch (error) {
        }
    }
}
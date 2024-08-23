import { Dynatrace, DynatraceAction } from "@dynatrace/react-native-plugin";
import * as _ from 'lodash'

export class DynActionTrackerManager {
    private static actions = new Map<string, DynatraceAction>();

    private constructor() {}

    public static startAction = (id: string,description: string): DynatraceAction => {
        const action = Dynatrace.enterAction(description);
        DynActionTrackerManager.actions.set(id, action);
        return action;
    }

    public static abortAction = (id: string): void => {
        const action = DynActionTrackerManager.actions.get(id);
        if(action !== undefined)return action.leaveAction();
    }

    public static reportEvent = (id: string, message: string): void => {
        const action = DynActionTrackerManager.actions.get(id);
        if(action !== undefined) action.reportEvent(message);
        if(action !== undefined) action.reportStringValue(`facephistatus_${id.toLowerCase()}`,message);

    }
}
  
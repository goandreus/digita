import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {storage} from '@utils/secure-storage';
import {Alert} from 'react-native';
import {IUser} from '@interface/User';

export const lastUser = createSlice({
  name: 'lastUser',
  initialState: (): IUser => {
    const lastUserString = storage.getString('lastUser');
    if (lastUserString !== undefined) {
      const lastUser: IUser = JSON.parse(lastUserString);
      return lastUser;
    } else return {};
  },
  reducers: {
    update: (state, action: PayloadAction<IUser>) => {
      if (
        action.payload.document !== undefined &&
        (action.payload.document.type !== state.document?.type ||
          action.payload.document.number !== state.document?.number)
      ) {
        storage.set('lastUser', JSON.stringify(action.payload));
        // Alert.alert(
        //   'LastUser in Storage',
        //   JSON.stringify(action.payload, null, 4),
        // );
        return action.payload;
      }

      const merged = {...state, ...action.payload};
      // Alert.alert('LastUser in Storage', JSON.stringify(merged, null, 4));
      storage.set('lastUser', JSON.stringify(merged));
      return merged;
    },
    clean: state => {
      storage.delete('lastUser');
      // Alert.alert('LastUser in Storage', JSON.stringify({}, null, 4));
      return {};
    },
  },
});

export const {update, clean} = lastUser.actions;

export default lastUser.reducer;

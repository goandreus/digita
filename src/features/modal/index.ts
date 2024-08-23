import {IModalState} from '@interface/Modal';
import {createSlice} from '@reduxjs/toolkit';

const initialState: IModalState = {
  tokenModal: {
    show: false,
  },
  informativeModal: {
    show: false,
    data: {
      title: '',
      content: '',
    },
  },
  sessionModal: {
    show: false,
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setTokenModal: (state, action) => {
      state.tokenModal = action.payload;
    },
    setInformativeModal: (state, action) => {
      state.informativeModal = action.payload;
    },
    setSessionModal: (state, action) => {
      state.sessionModal = action.payload;
    },
  },
});

export const {setTokenModal, setInformativeModal, setSessionModal} =
  modalSlice.actions;

export default modalSlice.reducer;

import {Fetch} from '@utils/apiFetch';
import {getToken} from '@utils/getToken';
import {KeyEnv, API_KEY_BANCA, CHANNEL} from '@constants';
import NativeConfig from 'react-native-config';
import {IFavorite} from '@screens/Operations/OtherAccounts/contexts/types';

export interface Query<T> {
  data: T;
  message: string;
  errorCode: string;
  isSuccess: boolean;
  isWarning: boolean;
}

export interface IFavoriteData {
  numberAccount: string;
}

export interface IFavoriteItem {
  alias: string;
  id: number;
  operationName: string;
  operationType: number;
  valueOperation: string;
  valueOperationFormatted: IFavoriteData;
}

export interface IEditFavorite {
  alias: string;
}

export const saveFavorite = async ({
  payload,
  documentType,
  documentNumber,
  screen,
}: {
  payload: IFavorite;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}): Promise<{type: string}> => {
  try {
    const data: Query<boolean> = await Fetch({
      url: '/channels/specific-ebranch-operations/api-utils/v1/favorites',
      method: 'POST',
      body: {
        ...payload,
        channel: CHANNEL,
      },
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'x-api-key': API_KEY_BANCA[NativeConfig.ENV as KeyEnv],
      },
      user: `0${documentType}${documentNumber}`,
      closeSessionOnError: true,
      screen,
      base: 'GEE',
    });

    if (data.isSuccess === true && data.data === true) {
      return {
        type: 'SUCCESS',
      };
    } else {
      return {
        type: 'NO-SUCCESS',
      };
    }
  } catch (error) {
    return {
      type: 'NO-SUCCESS',
    };
  }
};

export const getFavoritesOperations = async (
  optionType: string,
  documentType: number | undefined,
  documentNumber: string | undefined,
): Promise<IFavoriteItem[]> => {
  const filters: Record<string, string> = {
    Operations: '0',
    Transfers: '0?filter=transfer',
  };

  const operationId = filters[optionType];

  const data = await Fetch({
    url: `/channels/specific-ebranch-operations/api-utils/v1/favorites/${operationId}`,
    method: 'GET',
    base: 'GEE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'x-api-key': API_KEY_BANCA[NativeConfig.ENV as KeyEnv],
      client_id: API_KEY_BANCA[NativeConfig.ENV as KeyEnv],
    },
    user: `0${documentType}${documentNumber}`,
  });

  if (data.isSuccess === false) throw new Error(data.message);

  const favoritesOperations = data.data as IFavoriteItem[];
  favoritesOperations.sort((a, b) => {
    if (a.alias < b.alias) return -1;
    if (a.alias > b.alias) return 1;
    return 0;
  });

  const parse = (item: IFavoriteItem) => {
    const json = item.valueOperation;
    return {
      ...item,
      valueOperationFormatted: JSON.parse(json),
    };
  };

  return favoritesOperations.map(parse);
};

export const editFavorite = async ({
  payload,
  favoriteId,
  documentType,
  documentNumber,
  screen,
}: {
  payload: IEditFavorite;
  favoriteId: number;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}): Promise<{type: string}> => {
  try {
    const data: Query<boolean> = await Fetch({
      url: `/channels/specific-ebranch-operations/api-utils/v1/favorites/${favoriteId}`,
      method: 'PUT',
      body: payload,
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'x-api-key': API_KEY_BANCA[NativeConfig.ENV as KeyEnv],
      },
      user: `0${documentType}${documentNumber}`,
      closeSessionOnError: true,
      screen,
      base: 'GEE',
    });

    if (data.isSuccess === true && data.data === true) {
      return {
        type: 'SUCCESS',
      };
    } else {
      return {
        type: 'NO-SUCCESS',
      };
    }
  } catch (error) {
    return {
      type: 'NO-SUCCESS',
    };
  }
};

export const deleteFavorite = async ({
  favoriteId,
  documentType,
  documentNumber,
  screen,
}: {
  favoriteId: number;
  documentType?: number;
  documentNumber?: string;
  screen?: string;
}): Promise<{type: string}> => {
  try {
    const data: Query<boolean> = await Fetch({
      url: `/channels/specific-ebranch-operations/api-utils/v1/favorites/${favoriteId}`,
      method: 'DELETE',
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'x-api-key': API_KEY_BANCA[NativeConfig.ENV as KeyEnv],
      },
      user: `0${documentType}${documentNumber}`,
      closeSessionOnError: true,
      screen,
      base: 'GEE',
    });

    if (data.isSuccess === true && data.data === true) {
      return {
        type: 'SUCCESS',
      };
    } else {
      return {
        type: 'NO-SUCCESS',
      };
    }
  } catch (error) {
    return {
      type: 'NO-SUCCESS',
    };
  }
};

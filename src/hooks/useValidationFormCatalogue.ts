import yup from '@yup';
import {useCatalogueContext} from '@contexts/CatalogueContext';
import {CatalogueItem} from '@services/Catalogue';

type ObjectExtended<T> = {
  [K in keyof T]: T[K];
} & {
  [key: string]: any;
};

export function useValidationFormCatalogue<
  T extends {[key: string]: any},
  U extends {[key: string]: any},
>(initialSchema: T, values: U) {
  const catalogue = useCatalogueContext();

  const validationSchema: ObjectExtended<T> = {
    ...initialSchema,
  };

  const initialValues: ObjectExtended<U> = {
    ...values,
  };

  const toKey = (catalogueItem: CatalogueItem) =>
    `documento-${catalogueItem.descripcionCorta}`;

  const getCatalogueItemByKey = (key: string) =>
    catalogue.find(catalogueItem => toKey(catalogueItem) === key);

  catalogue.forEach(catalogueItem => {
    const key = toKey(catalogueItem);
    let schema: any;
    switch (catalogueItem.tipo) {
      case 'A':
      case 'N':
        schema = yup.string();
        schema = schema.when('documentType', {
          is: key,
          then: schema.required('Es obligatorio completar este dato'),
          otherwise: schema.transform(() => undefined).notRequired(),
        });

        switch (catalogueItem.precision) {
          case 0:
            schema = schema.max(
              catalogueItem.longitud,
              `El documento debe tener como máximo ${catalogueItem.longitud} ${catalogueItem.longitud <= 1 ? 'dígito' : 'dígitos'}`,
            );
            break;
          case 1:
            schema = schema.length(
              catalogueItem.longitud,
              `El documento debe tener ${catalogueItem.longitud} ${catalogueItem.longitud <= 1 ? 'dígito' : 'dígitos'}`,
            );
            break;
        }
        break;
    }
    validationSchema[key] = schema;
    /* (validationSchema as {[key: string]: any})[key] = schema; */
  });

  catalogue.forEach(catalogueItem => {
    const key = toKey(catalogueItem);
    let initialValue: any;
    switch (catalogueItem.tipo) {
      case 'A':
      case 'N':
        initialValue = '';
        break;
    }
    initialValues[key] = initialValue;

    if (catalogueItem.descripcionCorta === 'DNI') {
      initialValues['documentType'] = key;
    }
  });

  return {
    validationSchema: yup.object(validationSchema),
    initialValues,
    getCatalogueItemByKey,
  };
}

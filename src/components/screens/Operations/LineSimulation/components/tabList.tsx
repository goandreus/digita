import {View, Pressable, TextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {tabStyles as styles} from '../styles';
import TextCustom from '@atoms/extra/TextCustom';
import BoxView from '@atoms/BoxView';
import {COLORS} from '@theme/colors';
import Separator from '@atoms/extra/Separator';
import {useLineSimulationContext} from '../context';
import {useUserInfo} from '@hooks/common';
import {IElmentList} from '@interface/Credit';

type Cuota =
  | (IElmentList & {
      selected: boolean;
      editable: false;
    })
  | (Partial<IElmentList> & {
      value?: string;
      selected: boolean;
      editable: true;
    });

type TabProps = {
  text?: string;
  value?: string;
  selected: boolean;
  onPress: () => void;
};

const convertToQuotas = (list: IElmentList[]): Cuota[] => {
  const quotas = list.map(e => ({
    ...e,
    selected: false,
    editable: false,
  }));
  return [
    ...quotas,
    {
      order: list.length + 1,
      selected: false,
      editable: true,
    },
  ];
};

type EditableTabProps = TabProps & {
  ref: React.ForwardedRef<TextInput>;
  editable: boolean;
  limits: {
    min: number;
    max: number;
  };
  onChange: (text: string) => void;
};

const EditableTab = React.forwardRef<TextInput, EditableTabProps>(
  (props, ref) => {
    const {
      value,
      selected,
      editable,
      limits: {min, max},
      onPress,
      onChange,
    } = props;
    const [error, setError] = useState<boolean>(false);

    const hasError = (textError: string) => {
      const newNum = Number(textError);
      if (newNum < min || newNum > max) setError(true);
      else setError(false);
    };

    const onChangeQuota = (textQuota: string) => {
      const newText = textQuota.replace(/[^0-9]/g, '');
      hasError(newText);
      /* setNewQuota(newText); */
      onChange(newText);
    };

    useEffect(() => {
      let id: any;
      if (editable && selected && ref) {
        setError(false);
        id = setTimeout(() => {
          ref.current && ref.current.focus();
        }, 200);
      }

      return () => clearTimeout(id);
    }, [editable, selected, ref]);

    return (
      <View>
        <Pressable
          style={{
            ...styles.tabContainer,
            borderColor: selected ? COLORS.Primary.Medium : COLORS.Neutral.Dark,
          }}
          onPress={onPress}>
          <View
            style={{
              ...styles.itemTab,
              backgroundColor: selected
                ? COLORS.Primary.Lightest
                : COLORS.Background.Lightest,
            }}>
            <TextCustom
              text={'Otra cuota'}
              variation="h4"
              weight="normal"
              lineHeight="tight"
              color={selected ? 'primary-medium' : 'neutral-darkest'}
            />
          </View>
          {editable && selected && (
            <BoxView align="center" justify="center">
              <TextInput
                ref={ref}
                maxLength={2}
                keyboardType="numeric"
                value={value}
                onChangeText={onChangeQuota}
                style={{
                  ...styles.input,
                  color: error ? COLORS.Error.Medium : COLORS.Neutral.Darkest,
                }}
              />
            </BoxView>
          )}
        </Pressable>
        <Separator type="xx-small" />
        {error && selected && (
          <TextCustom
            text={`Ingresa un valor entre ${min} y ${max}`}
            variation="p5"
            weight="normal"
            lineHeight="tight"
            color="error-medium"
          />
        )}
      </View>
    );
  },
);

const Tab = ({text, selected, onPress}: TabProps) => {
  return (
    <Pressable
      style={{
        ...styles.tabContainer,
        borderColor: selected ? COLORS.Primary.Medium : COLORS.Neutral.Dark,
      }}
      onPress={onPress}>
      <View
        style={{
          ...styles.itemTab,
          backgroundColor: selected
            ? COLORS.Primary.Lightest
            : COLORS.Background.Lightest,
        }}>
        <TextCustom
          text={text}
          variation="h4"
          weight="normal"
          lineHeight="tight"
          color={selected ? 'primary-medium' : 'neutral-darkest'}
        />
      </View>
    </Pressable>
  );
};

export const TabList = () => {
  const inputRef = useRef<any>(null);
  const {userLineCredit} = useUserInfo();
  const {setSelectedQuota, limits} = useLineSimulationContext();

  const [cuotas, setCuotas] = useState<Cuota[]>(
    convertToQuotas(userLineCredit?.limitAmounts ?? []),
  );

  const onPressTab = (order?: number) => {
    const newCuotas = cuotas.map(item => {
      if (item.order === order) {
        setSelectedQuota(item.value ? Number(item.value) : null);
        return {...item, selected: true};
      } else if (item.editable) {
        return {...item, value: undefined, selected: false};
      }
      return {...item, selected: false};
    });
    setCuotas(newCuotas);
  };

  const onChange = (text: string) => {
    const newCuotas = cuotas.map(item => {
      if (item.editable) {
        setSelectedQuota(Number(text));
        return {...item, value: text};
      }
      return item;
    });
    setCuotas(newCuotas);
  };

  return (
    <View style={styles.lisTabContainer}>
      {cuotas.map((item, index) =>
        item.editable === true ? (
          <EditableTab
            ref={item.editable ? inputRef : undefined}
            key={index}
            onPress={() => onPressTab(item.order)}
            value={item.value}
            selected={item.selected}
            editable={item.editable}
            limits={{min: limits.minQuota, max: limits.maxQuota}}
            onChange={onChange}
          />
        ) : (
          <Tab
            key={`${item.order}-${item.value}`}
            text={item.name}
            selected={item.selected}
            onPress={() => onPressTab(item.order)}
          />
        ),
      )}
    </View>
  );
};

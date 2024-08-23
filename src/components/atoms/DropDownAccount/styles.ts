import { Platform, StyleSheet } from "react-native";
import { Colors } from "@theme/colors";

export const getStyles = (data: any[]) => {
    const stylesBase = StyleSheet.create({
        buttonStyle:{
            backgroundColor: '#fff',
            borderWidth: 1.5,
            borderTopStartRadius:8,
            borderTopEndRadius:8,
            borderBottomStartRadius:8,
            borderBottomEndRadius:8,
            width:'100%',
            height:70,
            borderColor:Colors.Border,
        },
        rowStyle:{
            marginTop: 15,
            borderBottomColor:'#FFF',
            borderBottomWidth:0,
        },
        dropdownStyle:{
            minHeight: data?.length > 2 ? 200 : (data?.length === 1 ? 80 : 136),
            maxHeight: data?.length > 2 ? 200 : (data?.length === 1 ? 80 : 136),
            marginTop:Platform.OS === 'ios' ? 9 : -18,
            padding:9,
            backgroundColor: '#fff',
            borderColor:'#EFEFEF',
            borderWidth: 1,
            borderTopStartRadius:8,
            borderTopEndRadius:8,
            borderBottomStartRadius:8,
            borderBottomEndRadius:8,
            shadowColor:'#444',
            shadowOpacity:0.18,
            shadowOffset: {
            width:0,
            height:0,
            },
            shadowRadius:8,
        },
    });
  
    return stylesBase;
  };
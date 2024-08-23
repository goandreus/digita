type ScreenTranslationMap = {
    [key: string]: string;
};

type FlowMap = {
    [key: string]: string;
};

const SCREEN_MAP: ScreenTranslationMap = {
    "Splash": "Splash",
    "Home": "Acceso",
    "LoginNormal": "Inicio Sesión - Usuario y Contraseña",
    "LoginSecure": "Inicio Sesión - Usuario Identificado",
    "MainScreen": "Inicio",
    "InfoActivateToken": "Generación Token Digital",
    "LoadingScreen": "Cargando",
    "RegisterIdentityInfo": "Valida tu Identidad",
    "RecoverPassword": "Olvidé mi Contraseña",
    "RegisterOTP": "Valida el Código",
    "RegisterPassword": "Creación Clave Digital",
    "InfoRegisterToken": "Generación Token Digital",
    "InfoRegisterSuccess": "Activación Token Digital",
    "ConfirmDocument": "Imágenes Capturadas",
    "ConfirmFace": "Selfie Capturada",
    "ScanDocument": "Activación Escáner",
    "ScanFace": "Activación Cámara"
};

const FLOW_MAP: FlowMap = {
    "FORGOT_PASSWORD": "Clave Olvidada",
    "LOGIN": "Inicio de Sesión",
    "REGISTER": "Registro"
}

export const getFormattedScreenName = (rawScreenName?: string) => rawScreenName === undefined ? undefined : SCREEN_MAP[rawScreenName] || undefined;
export const getFormattedFlowName = (rawFlowName?: string) => rawFlowName === undefined ? undefined : FLOW_MAP[rawFlowName] || undefined;
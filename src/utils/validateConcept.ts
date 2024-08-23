const regex = /^(?=.{1,60}$)[a-zA-Z 0-9\ñ\Ñ\ ]*$/;
const regexPass = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
export const validateConcept = (concept: string) => regex.test(concept);
export const validatePass = (password: string) => regexPass.test(password);
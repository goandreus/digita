import * as yup from 'yup';

yup.addMethod(
  yup.string,
  'startsWith',
  function startsWith(char: string, msg: string) {
    return this.test('test-starts-with', msg, (value, context) => {
      if (value === undefined) return true;
      if (value[0] === char) return true;
      return false;
    });
  },
);

declare module 'yup' {
  interface StringSchema {
    startsWith(char: string, msg: string): this;
  }
}

export default yup;

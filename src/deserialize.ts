export default (serializedJavascript: string) => {
  // eslint-disable-next-line no-eval
  return eval(`(${serializedJavascript})`);
};

export default serializedJavascript => {
  // eslint-disable-next-line no-eval
  return eval(`(${serializedJavascript})`);
};

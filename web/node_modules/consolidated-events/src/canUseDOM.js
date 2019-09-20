const CAN_USE_DOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

export default CAN_USE_DOM;

import normalizeEventOptions from './normalizeEventOptions';
import TargetEventHandlers from './TargetEventHandlers';

const EVENT_HANDLERS_KEY = '__consolidated_events_handlers__';

// eslint-disable-next-line import/prefer-default-export
export function addEventListener(target, eventName, listener, options) {
  if (!target[EVENT_HANDLERS_KEY]) {
    // eslint-disable-next-line no-param-reassign
    target[EVENT_HANDLERS_KEY] = new TargetEventHandlers(target);
  }
  const normalizedEventOptions = normalizeEventOptions(options);
  return target[EVENT_HANDLERS_KEY].add(eventName, listener, normalizedEventOptions);
}

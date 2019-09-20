import eventOptionsKey from './eventOptionsKey';

function ensureCanMutateNextEventHandlers(eventHandlers) {
  if (eventHandlers.handlers === eventHandlers.nextHandlers) {
    // eslint-disable-next-line no-param-reassign
    eventHandlers.nextHandlers = eventHandlers.handlers.slice();
  }
}

export default function TargetEventHandlers(target) {
  this.target = target;
  this.events = {};
}

TargetEventHandlers.prototype.getEventHandlers = function getEventHandlers(eventName, options) {
  const key = `${eventName} ${eventOptionsKey(options)}`;

  if (!this.events[key]) {
    this.events[key] = {
      handlers: [],
      handleEvent: undefined,
    };
    this.events[key].nextHandlers = this.events[key].handlers;
  }

  return this.events[key];
};

TargetEventHandlers.prototype.handleEvent = function handleEvent(eventName, options, event) {
  const eventHandlers = this.getEventHandlers(eventName, options);
  eventHandlers.handlers = eventHandlers.nextHandlers;
  eventHandlers.handlers.forEach((handler) => {
    if (handler) {
      // We need to check for presence here because a handler function may
      // cause later handlers to get removed. This can happen if you for
      // instance have a waypoint that unmounts another waypoint as part of an
      // onEnter/onLeave handler.
      handler(event);
    }
  });
};

TargetEventHandlers.prototype.add = function add(eventName, listener, options) {
  // options has already been normalized at this point.
  const eventHandlers = this.getEventHandlers(eventName, options);

  ensureCanMutateNextEventHandlers(eventHandlers);

  if (eventHandlers.nextHandlers.length === 0) {
    eventHandlers.handleEvent = this.handleEvent.bind(this, eventName, options);

    this.target.addEventListener(
      eventName,
      eventHandlers.handleEvent,
      options,
    );
  }

  eventHandlers.nextHandlers.push(listener);

  let isSubscribed = true;
  const unsubscribe = () => {
    if (!isSubscribed) {
      return;
    }

    isSubscribed = false;

    ensureCanMutateNextEventHandlers(eventHandlers);
    const index = eventHandlers.nextHandlers.indexOf(listener);
    eventHandlers.nextHandlers.splice(index, 1);

    if (eventHandlers.nextHandlers.length === 0) {
      // All event handlers have been removed, so we want to remove the event
      // listener from the target node.

      if (this.target) {
        // There can be a race condition where the target may no longer exist
        // when this function is called, e.g. when a React component is
        // unmounting. Guarding against this prevents the following error:
        //
        //   Cannot read property 'removeEventListener' of undefined
        this.target.removeEventListener(
          eventName,
          eventHandlers.handleEvent,
          options,
        );
      }

      eventHandlers.handleEvent = undefined;
    }
  };
  return unsubscribe;
};

export const noop = () => {};

export * from './EthContext';

export * from './hooks';

export const WINDOW_TYPE = {
  POPUP: 0,
  NOTIFICATION: 1,
  BACKGROUND: 2,
}

export const checkWindowType = () => {
  const { pathname } = window.location;

  switch (pathname) {
    case '/popup.html':
      return WINDOW_TYPE.POPUP;
    case '/notification.html':
      return WINDOW_TYPE.NOTIFICATION;
    default:
      return WINDOW_TYPE.BACKGROUND;
  }
}

export const isNotification = () => checkWindowType() === WINDOW_TYPE.NOTIFICATION;

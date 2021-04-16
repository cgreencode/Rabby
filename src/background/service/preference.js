import { createPersistStore } from 'background/utils';

class Preference {
  init = async () => {
    this.store = await createPersistStore({ name: 'preference' });
  };

  setup = () => {
    this.store.setup = true;
  };

  isSetup = () => this.store.setup;

  getCurrentAccount = () => this.store.currentAccount;

  setCurrentAccount = (val) => {
    this.store.currentAccount = val;
  };
}

export default new Preference();

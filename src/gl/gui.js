import dat from 'dat.gui';

let index = 0;

class GUI {
  constructor() {
    if (process.env.NODE_ENV !== 'production') {
      const gui = new Proxy(new dat.GUI(), handlers);
      gui.props = {};
      gui.close();

      return gui;
    }
  }
}

const functions = {
  addNew(name, initialValue, ...args) {
    const key = `key${index++}`;
    this.props[key] = initialValue;
    return this.add(this.props, key, ...args).name(name);
  },

  addNewColor(key, initialValue) {
    this.props[key] = initialValue;
    return this.addColor(this.props, key);
  },

  addFolder(name) {
    const folder = this.addFolder(name);
    folder.props = {};
    return new Proxy(folder, handlers);
  },
};

const handlers = {
  get: (target, prop) => {
    if (prop in functions) {
      return functions[prop].bind(target);
    }

    return target[prop];
  },
};

const gui = new GUI();

export default gui;

// Underreact: a (deficient) React clone in 99 lines
export class Component {
  constructor (props = {}) {
    this.props = props;
    this.state = {};
    this._overReactElement = null;
    return this;
  }

  setState (state = {}) {
    Object.assign(this.state, state);
  }

  render () {
    return null;
  }
}

class Element {
  constructor (opts) {
    const { type, props, children = [] } = opts;
    this.props = { type, props, children };
    this._overReactElement = null;
    this._element = this.render();
    this._componentInstance = null;
    this._textNode = null;
    return this;
  }

  hasComponent () {
    return typeof this.props.type !== 'string';
  }

  renderComponent () {
    const { type, props } = this.props;
    this._componentInstance = new type(props);
    this.props.children = [this._componentInstance.render()];
  }

  renderElement (type = this.props.type) {
    return document.createElement(type);
  }

  render () {
    if (this.hasComponent()) {
      return this.renderComponent();
    } else {
      return this.renderElement();
    }
  }

  updateProps () {
    [...this._element.attributes].forEach((attr) => {
      this._element[attr] = this.props.props[attr] || null;
    });
  }

  updateChildren () {
    if (this.props.children instanceof Array) {
      this.props.children.forEach((child) => child.update());
    } else {
      if (this._textNode) {
        this._element.removeChild(this._textNode);
      }
      this._textNode = document.createTextNode(this.props.children);
      this._element.appendChild(this._textNode);
    }
  }

  update () {
    if (!this.hasComponent()) {
      this.updateProps();
    }
    this.updateChildren();
  }

  mountOn (_parent) {
    this.update();
    const elementToMountOn = this._element || _parent;
    if (this.props.children instanceof Array) {
      this.props.children.forEach((child) => child.mountOn(elementToMountOn));
    } else {
      this._element.appendChild(this._textNode);
    }
    if (this._element) {
      _parent.appendChild(this._element);
    }
  }
}

export function createElement (type, props = {}, children) {
  children = children || props.children;
  return new Element({ type, props, children });
  // TODO:
  // return object with memoized stuff! Of course!
}

export function render (overReactElement, element) {
  overReactElement.mountOn(element);
}

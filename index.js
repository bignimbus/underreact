// Underreact: a (deficient) React clone in 99 lines
export class Component {
  constructor (props = {}) {
    this.props = props;
    this.state = {};
    return this;
  }

  setState (state) {
    Object.assign(this.state, state);
    const oldElement = this._element;
    if (this.props._parent) {
      this._element = render(this.render(), this.props._parent, oldElement);
    } else {
      this.render().mountOn();
    }
  }

  render () {
    return null;
  }
}

class Element {
  constructor (opts) {
    const { type, props, children = [] } = opts;
    this.props = { type, props, children };
    return this;
  }

  bindHtmlProps (el) {
    const { props = {} } = this.props;
    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        el[key] = props[key];
      }
    }
  }

  renderChildren (el, children) {
    if (typeof children === 'string') {
      el.appendChild(document.createTextNode(children));
    } else {
      children.forEach((child) => {
        el.appendChild(child.mountOn(el));
      });
    }
  }

  mountOverReactElement () {
    const { type, props, children } = this.props;
    const { _parent } = this;
    const instance = new type({ ...props, _parent });
    const el = instance.render();
    if (el == null) return el;
    instance._element = el.mountOn(_parent);
    return instance._element;
  }

  mountHtmlElement () {
    const { type, props, children } = this.props;
    const el = document.createElement(type);
    this.bindHtmlProps(el);
    this.renderChildren(el, children);
    return el;
  }

  mountOn (_parent) {
    this._parent = _parent;
    if (typeof this.props.type !== 'string') {
      return this.mountOverReactElement();
    } else {
      return this.mountHtmlElement();
    }
  }
}

export function createElement (type, props = {}, children) {
  return new Element({ type, props, children || props.children });
}

function update (el, parent) {
  return el.mountOn(parent);
}

function destroy (el) {
  [...(el.children || [])].forEach((child) => destroy(child));
  [...el.attributes].forEach((attr) => el[attr] = null);
  el = null;
}

export function render (el, element, oldElement) {
  if (oldElement) {
    element.removeChild(oldElement);
    destroy(oldElement);
  }
  const _el = update(el, element);
  element.appendChild(_el);
  return _el;
}

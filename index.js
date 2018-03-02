// Underreact: a (deficient) React clone in 100 lines
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
      this.render().renderer()();
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
    this.instance = null;
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
        el.appendChild(child.renderer(el)());
      });
    }
  }

  overReactElementRenderer () {
    const { type, props, children } = this.props;
    const { _parent } = this;
    const renderOverReactComponent = () => {
      const instance = new type({ ...props, _parent });
      const el = instance.render();
      if (el == null) return el;
      instance._element = el.renderer(_parent)();
      return instance._element;
    };
    return renderOverReactComponent;
  }

  htmlElementRenderer () {
    const { type, props, children } = this.props;
    const renderHtmlElement = () => {
      const el = document.createElement(type);
      this.bindHtmlProps(el);
      this.renderChildren(el, children);
      return el;
    }
    return renderHtmlElement;
  }

  renderer (_parent) {
    this._parent = _parent;
    if (typeof this.props.type !== 'string') {
      return this.overReactElementRenderer();
    } else {
      return this.htmlElementRenderer();
    }
  }
}

export function createElement (type, props = {}, children) {
  children = children || props.children;
  const el = new Element({ type, props, children });
  return el;
}

function update (el, parent) {
  return el.renderer(parent)();
}

export function render (el, element, oldElement) {
  if (oldElement) element.removeChild(oldElement);
  const _el = update(el, element);
  element.appendChild(_el);
  return _el;
}

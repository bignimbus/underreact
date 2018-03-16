import {
  Component,
  Element,
  createElement,
  render,
} from './';

describe('Underreact', () => {
  it('should render DOM elements', () => {
    const main = document.createElement('main');
    const overReactElement = createElement('div', null, [
      createElement('h1', null, 'Hello, world!'),
      createElement('p', null, 'good to be here'),
    ]);
    render(overReactElement, main);
    expect(main.outerHTML).toMatchSnapshot();
  });

  it('should render Underreact Components', () => {
    class MyComponent extends Component {
      render () {
        return createElement('div', null, [
          createElement('h1', null, 'Hello, world!'),
          createElement('p', null, 'Sup'),
        ]);
      }
    }

    const main = document.createElement('main');
    const overReactElement = createElement(MyComponent);

    render(overReactElement, main);
    expect(main.outerHTML).toMatchSnapshot();
  });

  it('can render props', () => {
    class MyComponent extends Component {
      render () {
        return createElement('p', null, this.props.foo);
      }
    }

    const main = document.createElement('main');
    const overReactElement = createElement(MyComponent, { foo: 'bar' });
    render(overReactElement, main);
    expect(main.outerHTML).toMatchSnapshot();
  });

  it('can render state', () => {
    class MyComponent extends Component {
      constructor (props) {
        super(props);
        this.state = { foo: 'foo' };
      }

      render () {
        return createElement('p', null, this.state.foo);
      }
    }

    const component = new MyComponent();
    expect(component.render().props.children).toBe('foo');
    component.setState({ foo: 'bar' });
    expect(component.render().props.children).toBe('bar');
  });

  fit('can rerender when state changes', async () => {
    class MyComponent extends Component {
      constructor (props) {
        super(props);
        this.state = { foo: 'foo' };
        document.addEventListener('myEvent', () => {
          this.setState({ foo: 'bar' });
        }, false);
      }

      render () {
        return createElement('p', null, this.state.foo);
      }
    }

    expect.assertions(2);

    const main = document.createElement('main');
    const overReactElement = createElement(MyComponent, { foo: 'bar' });
    render(overReactElement, main);
    expect(main.outerHTML).toMatchSnapshot();

    document.dispatchEvent(new Event('myEvent'));
    await new Promise(res => setTimeout(res, 50));
    expect(main.outerHTML).toMatchSnapshot();
  });

  it('can bind event listeners', async () => {
    class MyComponent extends Component {
      constructor (props) {
        super(props);
        this.state = { clicked: false };
      }

      render () {
        return createElement('div', null, [
          createElement('h1', null, `The button has ${this.state.clicked ? '' : 'not '}been clicked`),
          createElement('button', {
            onclick: () => this.setState({ clicked: true }),
          }, 'Click me'),
        ]);
      }
    }

    expect.assertions(2);

    const main = document.createElement('main');
    const overReactElement = createElement(MyComponent);
    render(overReactElement, main);
    expect(main.outerHTML).toMatchSnapshot();

    const button = main.querySelector('button');
    button.dispatchEvent(new Event('click'));

    await new Promise(res => setTimeout(res, 50));

    expect(main.outerHTML).toMatchSnapshot();
  });

  it('can rerender child components with updated props', async () => {
    class ChildComponent extends Component {
      render () {
        if (this.props.clicked) {
          return createElement('h1', null, 'The parent element was clicked');
        } else {
          return createElement('h1', null, 'The parent element was not clicked');
        }
      }
    }

    class MyComponent extends Component {
      constructor (props) {
        super(props);
        this.state = { clicked: false };
      }

      render () {
        return createElement('div', null, [
          createElement(ChildComponent, { clicked: this.state.clicked }),
          createElement('button', {
            onclick: () => this.setState({ clicked: true }),
          }, 'Click me'),
        ]);
      }
    }

    expect.assertions(2);

    const main = document.createElement('main');
    const overReactElement = createElement(MyComponent);
    render(overReactElement, main);
    expect(main.outerHTML).toMatchSnapshot();

    const button = main.querySelector('button');
    button.dispatchEvent(new Event('click'));

    await new Promise(res => setTimeout(res, 50));

    expect(main.outerHTML).toMatchSnapshot();
  });
});

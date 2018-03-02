import { createElement, Component, render } from '../index.js';

class MyComponent extends Component {
  constructor (props) {
    super(props);
    this.state = { clicks: 0 };
  }

  render () {
    return createElement('div', { id: 'container' }, [
      createElement('h1', null, 'Underreact'),
      createElement('p', null, 'A sketchy React clone'),
      createElement('section', null, [
        createElement('div', null, [
          createElement('label', null, [
            createElement('span', null, 'Clicks'),
            createElement('input', {
              id: 'click-count',
              value: this.state.clicks,
              onchange: e => this.setState({ clicks: parseInt(e.target.value) }),
            }),
          ]),
          createElement('button', {
            onclick: () => {
              this.setState({ clicks: this.state.clicks + 1 });
            },
          }, 'Add a click'),
        ]),
      ]),
    ]);
  }
}

const main = document.querySelector('main');
console.log(main);

render(createElement(MyComponent), main);

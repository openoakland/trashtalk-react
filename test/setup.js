import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import GoogleMapsMock from './GoogleMapsMock';

// Setup Enzyme Adapter: http://airbnb.io/enzyme/#installation
configure({
  adapter: new Adapter()
});

// Setup fake DOM: http://airbnb.io/enzyme/docs/guides/jsdom.html#using-enzyme-with-jsdom
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}

window.google = GoogleMapsMock;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

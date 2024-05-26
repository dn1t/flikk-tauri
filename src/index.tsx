/* @refresh reload */
import { render } from 'solid-js/web';
import App from './app';

import '@phosphor-icons/web/regular';
import './fonts.css';
import './index.css';

render(() => <App />, document.getElementById('root') as HTMLElement);

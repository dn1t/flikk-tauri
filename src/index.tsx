/* @refresh reload */
import '@phosphor-icons/web/regular';
import { render } from 'solid-js/web';
import App from './app';

import './fonts.css';
import './index.css';

render(() => <App />, document.getElementById('root') as HTMLElement);

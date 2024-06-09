import { Route, Router } from '@solidjs/router';
import type { ParentProps } from 'solid-js';
import { Sidebar } from './components/common/sidebar';
import { FlikkProvider } from './context';
import Categories from './routes/categories';
import Home from './routes/home';
import Player from './routes/player';
import VOD from './routes/vod';

function Layout(props: ParentProps) {
  return (
    <>
      <Sidebar />
      <main class='w-full h-screen pr-1.5 py-1.5'>
        <div class='w-full h-full bg-gray-1 rounded-lg'>{props.children}</div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <FlikkProvider>
      <Router root={Layout}>
        <Route path='/' component={Home} />
        <Route path='/vod' component={VOD} />
        <Route path='/categories' component={Categories} />
        <Route path='/player/:platform/:id' component={Player} />
      </Router>
    </FlikkProvider>
  );
}

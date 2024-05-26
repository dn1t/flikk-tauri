import { Route, Router } from '@solidjs/router';
import type { ParentProps } from 'solid-js';
import { Sidebar } from './components/common/sidebar';
import Categories from './routes/categories';
import Home from './routes/home';
import Videos from './routes/videos';

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
    <>
      <Router root={Layout}>
        <Route path='/' component={Home} />
        <Route path='/videos' component={Videos} />
        <Route path='/categories' component={Categories} />
      </Router>
    </>
  );
}

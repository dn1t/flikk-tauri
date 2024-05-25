import { Sidebar } from './components/common/sidebar';

export default function App() {
  return (
    <>
      <Sidebar />
      <main class='w-full h-screen p-1.5'>
        <div class='w-full h-full bg-gray-1 rounded-lg'>
          <div class='px-4 py-3'>
            <h1>Hello, world!</h1>
          </div>
        </div>
      </main>
    </>
  );
}

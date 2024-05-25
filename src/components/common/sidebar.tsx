export function Sidebar() {
  return (
    <section class='w-60 h-screen'>
      <div
        class='flex items-center gap-x-1 px-4 pt-12 pb-2'
        data-tauri-drag-region
      >
        <img
          src='/flikk.png'
          alt='Flikk 로고'
          class='w-7 h-7 pointer-events-none'
        />
        <h1 class='font-semibold text-2xl pointer-events-none'>Flikk</h1>
      </div>
      <div class='flex flex-col px-4'></div>
    </section>
  );
}

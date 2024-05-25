export function Sidebar() {
  return (
    <section class='w-52 h-screen px-4 pt-12' data-tauri-drag-region>
      <div class='flex items-center gap-x-1'>
        <img src='/flikk.png' alt='Flikk 로고' class='w-7 h-7' />
        <h1 class='font-semibold text-2xl'>Flikk</h1>
      </div>
    </section>
  );
}

export function Header(props: { title: string }) {
  return (
    <header class='px-8 pt-14 pb-3'>
      <h1 class='font-bold text-3xl'>{props.title}</h1>
    </header>
  );
}

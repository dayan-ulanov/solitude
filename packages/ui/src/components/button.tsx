export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-4 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-400 uppercase ${props.className}`}
    >
      {props.children}
    </button>
  );
}

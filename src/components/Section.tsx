function Section({
  color,
  children,
  id,
}: {
  color?: string;
  children?: React.ReactNode;
  id: string;
}) {
  return (
    <div
      id={id}
      className={`${color} section relative w-full h-screen flex items-center justify-center m-0 p-0 overflow-hidden`}
    >
      {children}
    </div>
  );
}

export default Section;

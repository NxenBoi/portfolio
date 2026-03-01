function Section({
  color,
  children,
}: {
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`${color} section relative w-full h-screen flex items-center justify-center m-0 p-0 overflow-hidden`}
    >
      {children}
    </div>
  );
}

export default Section;

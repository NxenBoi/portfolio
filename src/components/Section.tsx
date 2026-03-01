function Section({ children }: { children?: React.ReactNode }) {
  return (
    <div className="section w-full h-screen flex items-center justify-center m-0 p-0">
      {children}
    </div>
  );
}

export default Section;

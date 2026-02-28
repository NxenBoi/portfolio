function Section({ children }: { children?: React.ReactNode }) {
  return (
    <div className="section w-screen h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

export default Section;

interface Props {
  src: string;
  className: string;
}

function Icon({ src, className }: Props) {
  return <img src={src} className={className} />;
}

export default Icon;

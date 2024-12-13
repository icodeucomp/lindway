export interface BackgroundProps {
  src: string;
  alt: string;
  className?: string;
  parentClassName?: string;
  isHover?: boolean;
  isTop?: boolean;
  children: JSX.Element | JSX.Element[];
}

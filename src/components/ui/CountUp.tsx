'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

type Props = {
  value: number;
  format?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
};

export default function CountUp({ value, format, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1200, bounce: 0 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(
    () =>
      spring.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = format ? format(latest) : Math.round(latest).toString();
        }
      }),
    [spring, format]
  );

  return (
    <span ref={ref} className={className} style={style}>
      {format ? format(0) : '0'}
    </span>
  );
}

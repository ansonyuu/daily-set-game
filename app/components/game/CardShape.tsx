'use client';

import { Shape, Color, Shading, COLORS } from '@/lib/game/types';

interface CardShapeProps {
  shape: Shape;
  color: Color;
  shading: Shading;
  index: number;
}

// SVG paths for each shape - using original vertical paths with rotation transform
const SHAPE_PATHS = {
  diamond: { d: 'M25 0 L50 50 L25 100 L0 50 Z' },
  oval: { d: 'M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60C44.5,90.8,35.8,99.5,25,99.5z' },
  squiggle: { d: 'M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z' },
};

export default function CardShape({ shape, color, shading, index }: CardShapeProps) {
  const colorValue = COLORS[color];
  const patternId = `stripe-${color}-${index}`;
  const shapeData = SHAPE_PATHS[shape];

  return (
    <svg viewBox="-25 -10 150 70" className="w-full h-full">
      <defs>
        {/* Stripe pattern for striped shading */}
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke={colorValue}
            strokeWidth="2"
          />
        </pattern>
      </defs>

      <g transform="translate(50, 25) rotate(90) translate(-25, -50)">
        <path
          d={shapeData.d}
          fill={
            shading === 'solid'
              ? colorValue
              : shading === 'striped'
              ? `url(#${patternId})`
              : 'none'
          }
          stroke={colorValue}
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

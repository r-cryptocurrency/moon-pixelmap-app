import ColorHash from "color-hash";
import React from "react";

const colorHash = new ColorHash({ saturation: 1.0 });

const stringToColour = (s: string): string => colorHash.hex(s);

const generateColours = (s: string): [string, string] => {
  const s1 = s.substring(0, s.length / 2);
  const s2 = s.substring(s.length / 2);
  const c1 = stringToColour(s1);
  const c2 = stringToColour(s2);

  return [c1, c2];
};

interface Props {
  address: string;
  size: number;
}

const SVG: React.FC<Props> = (props) => {
  const [c1, c2] = generateColours(props.address);

  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox={`0 0 ${props.size} ${props.size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={props.size / 2}
        cy={props.size / 2}
        r={props.size / 2}
        fill={`url(#gradient-${props.address})`}
      />
      <defs>
        <linearGradient
          id={`gradient-${props.address}`}
          x1="0"
          y1="0"
          x2={props.size}
          y2={props.size}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SVG;

import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowLeft01Icon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <Path 
      d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" 
      stroke={props.color || "#000000"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export default ArrowLeft01Icon;

import React, { ReactNode } from 'react';
import Grid from '../layout/grid';

interface SmallBoxProps {
  cols?: string;        // Ex: "12 6 4 3"
  color: string;        // Ex: "red", "blue"
  value: number | string;
  text: string;
  icon: string;         // Ex: "user", "shopping-cart"
  children?: ReactNode; // Caso queira usar filhos
}

const SmallBox: React.FC<SmallBoxProps> = (props) => (
  <Grid cols={props.cols}>
    <div className={`small-box bg-${props.color}`}>
      <div className='inner'>
        <h3>{props.value}</h3>
        <p>{props.text}</p>
      </div>
      <div className='icon'>
        <i className={`fa fa-${props.icon}`}></i>
      </div>
    </div>
  </Grid>
);

export default SmallBox;

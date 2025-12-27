import React, { ReactNode } from 'react';

interface GridProps {
  cols?: string;         // Ex: "12 6 4 3"
  children?: ReactNode;  // Para permitir elementos filhos
}

const toCssClasses = (numbers?: string): string => {
  const cols = numbers ? numbers.split(' ') : [];
  let classes = '';

  if (cols[0]) classes += `col-xs-${cols[0]}`;
  if (cols[1]) classes += ` col-sm-${cols[1]}`;
  if (cols[2]) classes += ` col-md-${cols[2]}`;
  if (cols[3]) classes += ` col-lg-${cols[3]}`;

  return classes;
};

const Grid: React.FC<GridProps> = ({ cols = '12', children }) => {
  const gridClasses = toCssClasses(cols);

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export default Grid;
import React from 'react';

import './style.css';

export default function Hello(props) {
  const { layout } = props;
  return (
    <div className="my-unique-class">
      Hell0 React
      {layout.title}
    </div>
  );
}

import React, { useState } from 'react';


const Circle = ({ initials }) => {
  const [color, setColor] = useState(generateRandomColor());

  function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div className="circle" style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
};

export default Circle;
import React from 'react';

const Divider = () => {
  return (
    <div className="w-full flex justify-center py-8">
      <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10 C 20 20, 30 0, 50 10 S 70 20, 100 10 S 130 0, 150 10 S 180 20, 200 10" stroke="hsl(130, 20%, 65%)" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export default Divider;

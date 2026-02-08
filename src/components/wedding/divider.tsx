import React from 'react';
import Image from 'next/image';

const Divider = () => {
  return (
    <div className="w-full flex justify-center py-4">
      <Image
        src="/floral-banner.png"
        alt="Separador floral"
        width={300}
        height={63}
        className="w-auto h-auto opacity-70"
      />
    </div>
  );
};

export default Divider;

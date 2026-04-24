import React, { useState } from 'react';

export default function SidePanel({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='h-80-vh w-32 flex flex-col border-r'>
        <div c>

        </div>

    </div>
  );
}

export function SidePanelItem ({label}) {
    return (
        <div>
            {label}
        </div>
    );
}
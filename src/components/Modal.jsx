import React from 'react';

export default function Modal({ isOpen, handleModal, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 "
      tabIndex={-1}
      onBlur={()=>alert()}
    >
      <div
        className="p-1 bg-transparent rounded shadow-lg w-1/3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}

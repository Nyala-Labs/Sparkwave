"use client";

import { ReactNode, useState } from "react";

type DialogProps = {
  btnTitle: string;
  children: ReactNode;
  submitTitle: string;
};

const Dialog = ({ btnTitle, children }: DialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        {btnTitle}
      </button>

      {open && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box relative">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            {children}
          </div>

          <div className="modal-backdrop" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Dialog;

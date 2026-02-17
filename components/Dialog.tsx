"use client";

import { ReactNode } from "react";

type DialogProps = {
  btnTitle: string;
  children: ReactNode;
  submitTitle: string;
};
const Dialog = (props: DialogProps) => {
  return (
    <>
      <label htmlFor={`modal_${props.btnTitle}`} className="btn">
        {props.btnTitle}
      </label>

      <input
        type="checkbox"
        id={`modal_${props.btnTitle}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div>{props.children}</div>
        </div>
      </div>
    </>
  );
};

export default Dialog;

import React, { FC, useCallback, useState } from "react";

//*regist: cancel save, *confirm: no yes, *
interface Props {
  children: JSX.Element;
  title: string;
  show: boolean;
  onCloseModalHandler: () => void;
}

const FormhModal: FC<Props> = ({
  children,
  title,
  show,
  onCloseModalHandler,
}) => {
  return (
    <>
      {show && (
        <div className="modal-bg center">
          <div className="center-item">
            <div className="modal-wrap">
              <div className="modal__head">
                <span>{title}</span>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onCloseModalHandler}
                >
                  X
                </button>
              </div>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormhModal;

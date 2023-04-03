import React, { FC, useCallback, useState } from "react";

//*regist: cancel save, *confirm: no yes, *
interface Props {
  title: string;
  content: string;
  show: boolean;
  footType: "regist" | "confirm" | "etc";
  onCloseModalHandler: () => void;
}

const AlertModal: FC<Props> = ({
  title,
  footType,
  content,
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
              </div>
              <div className="modal__body">
                <div className="modal__content">{content}</div>
              </div>
              <div className="modal__footer">
                {footType === "confirm" && (
                  <button
                    type="button"
                    className="btn-confirm"
                    onClick={onCloseModalHandler}
                  >
                    확인
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertModal;

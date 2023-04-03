import React, { FC } from "react";
import backimg from "@assets/images/backimg.jpg";
interface Props {
  WsList: {
    wsname: string;
    category: string;
    verifyage: string;
    greeting: string;
  }[];
}

const WorkspaceList: FC<Props> = ({ WsList }) => {
  return (
    <>
      <ul className="ws--lists scrollbar">
        {WsList?.map((ws, idx) => {
          return (
            <li
              className="vertical"
              key={`ws-${ws.wsname}--${ws.category}${idx}`}
            >
              <div className="float-clear ws--title">
                <span className="h3">{ws.wsname}</span>
                <span
                  className={
                    ws.verifyage === "Adult"
                      ? "float-right badge negative"
                      : "float-right badge positive"
                  }
                >
                  {ws.verifyage}
                </span>
              </div>

              <div className="ws--summary">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Eligendi, corporis dolorem aliquid exercitationem eum
                voluptatum, quasi suscipit repellat impedit iusto iure
                dignissimos a expedita commodi vero sapiente aut. Rerum, itaque.
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default WorkspaceList;

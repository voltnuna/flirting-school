import React, { FC, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiChatNewFill } from "react-icons/ri";
import { CgInbox } from "react-icons/cg";

interface Props {
  title?: string;
  menus?: { name: string }[];
  onSwitchPage?: () => void;
}

const Header: FC<Props> = ({ title, menus, onSwitchPage }) => {
  const { workspace, channel } = useParams<{
    workspace?: string;
    channel?: string;
  }>();

  return (
    <>
      <header>
        <nav>
          <ul className="list-horizontal">
            {!title ? (
              <li>
                <span className="h1">{`${
                  channel !== undefined ? `##${channel}` : `#${workspace}`
                }`}</span>
              </li>
            ) : (
              <li>
                <span className="h1">{`${title}`}</span>
              </li>
            )}
            {menus?.map((menu, idx) => {
              return (
                <li key={`header--${idx}`} className="list-horizontal__item">
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchPage && onSwitchPage();
                    }}
                  >
                    {menu.name ? menu.name : workspace}
                  </button>
                </li>
              );
            })}
          </ul>
          <ul className="list-horizontal head-utilbox">
            <li className="list-horizontal__item">
              <button type="button">
                <RiChatNewFill color="#b9bbbe" size="23" />
              </button>
            </li>
            <li>
              <button>
                <CgInbox color="#b9bbbe" size="23" />
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;

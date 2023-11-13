import React, { useState } from "react";
import { FormatedMessage } from "../types";
import { ImWarning } from "react-icons/im";
import Markdown from "react-markdown";
import "./DisplayMessage.css";

const DisplayMessage = ({
  message,
}: {
  message: FormatedMessage | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return message ? (
    <div className="container" onClick={() => setIsOpen(!isOpen)}>
      <div className="title">
        <ImWarning color="orange" size={16} style={{ marginRight: "0.5rem" }} />{" "}
        {message.title}
      </div>
      {isOpen && <Markdown className="content">{message.content}</Markdown>}
    </div>
  ) : null;
};

export default DisplayMessage;

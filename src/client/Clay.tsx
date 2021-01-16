import * as S from "./Clay.styles";
import React from "react";
import { createEditor, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export interface ClayProps {
  className?: string;
  id: string;
}

const Clay: React.FC<ClayProps> = ({ className }) => {
  const editor = React.useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = React.useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable />
    </Slate>
  );
};

export default Clay;

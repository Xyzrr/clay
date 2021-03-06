import * as S from "./Clay.styles";
import React from "react";
import { createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";
import { withIOCollaboration, useCursor } from "@slate-collaborative/client";
import randomColor from "randomcolor";
import Caret from "./Caret";

export interface ClayProps {
  className?: string;
  id: string;
}

const Clay: React.FC<ClayProps> = ({ className }) => {
  const [value, setValue] = React.useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "Loading..." }],
    },
  ]);

  const [isOnline, setOnlineState] = React.useState(false);

  const color = React.useMemo(
    () =>
      randomColor({
        luminosity: "dark",
        format: "rgba",
        alpha: 1,
      }),
    []
  );

  const editor = React.useMemo(() => {
    const slateEditor = withReact(withHistory(createEditor()));

    const origin = "https://clay-server.herokuapp.com";
    // const origin = "http://localhost:5000";

    const slug = "sluggy";

    const name = "Joe Biden";

    const options = {
      docId: "/" + slug,
      cursorData: {
        name,
        color,
        alphaColor: color.slice(0, -2) + "0.2)",
      },
      url: `${origin}/${slug}`,
      connectOpts: {
        query: {
          name,
          token: "wootest",
          slug,
        },
      },
      onConnect: () => setOnlineState(true),
      onDisconnect: () => setOnlineState(false),
    };

    return withIOCollaboration(slateEditor, options);
  }, []);

  React.useEffect(() => {
    editor.connect();

    return editor.destroy;
  }, []);

  const { decorate } = useCursor(editor);

  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [decorate]
  );

  const renderElement = React.useCallback((props: RenderElementProps) => {
    return <Paragraph {...props}></Paragraph>;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
      />
    </Slate>
  );
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span
      {...attributes}
      style={
        {
          position: "relative",
          backgroundColor: leaf.alphaColor,
        } as any
      }
    >
      {leaf.isCaret ? <Caret {...(leaf as any)} /> : null}
      {children}
    </span>
  );
};

const Paragraph: React.FC<RenderElementProps> = ({
  attributes,
  element,
  children,
}) => {
  return <S.Paragraph {...attributes}>{children}</S.Paragraph>;
};

export default Clay;

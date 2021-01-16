import * as S from "./Clay.styles";
import React from "react";
import { createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import { withIOCollaboration, useCursor } from "@slate-collaborative/client";

export interface ClayProps {
  className?: string;
  id: string;
}

const Clay: React.FC<ClayProps> = ({ className }) => {
  const [value, setValue] = React.useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  const [isOnline, setOnlineState] = React.useState(false);

  const editor = React.useMemo(() => {
    const slateEditor = withReact(withHistory(createEditor()));

    const origin = "https://clay-server.herokuapp.com";

    const slug = "sluggy";

    const name = "Joe Biden";

    const options = {
      docId: "/" + slug,
      cursorData: {
        name,
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

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable decorate={decorate} />
    </Slate>
  );
};

export default Clay;

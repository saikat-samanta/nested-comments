import React from "react";
import "./styles.css";
import { Comment, type CommentProps } from "./Comment";

function findNestedObj(
  entireObj: any,
  keyToFind: string,
  valToFind: string,
  message?: string,
  isDelete?: boolean
) {
  const uniqueId = (Math.random() * 100000).toString();
  const foundObj = JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind] === valToFind) {
      if (isDelete) {
        nestedValue = undefined;
      } else {
        if (nestedValue.replies) {
          nestedValue.replies?.push({
            id: uniqueId,
            comment: message,
          });
        } else {
          nestedValue.replies = [
            {
              id: uniqueId,
              comment: message,
            },
          ];
        }
      }
    }
    return nestedValue;
  });

  return JSON.parse(foundObj);
}

function App() {
  const [comments, setComments] = React.useState<CommentProps["comment"][]>([
    {
      id: "1",
      comment: "test1",
      replies: [
        {
          id: "3",
          comment: "test3",
          replies: [
            {
              id: "5",
              comment: "test5",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      comment: "test2",
      replies: [
        {
          id: "4",
          comment: "test4",
        },
      ],
    },
  ]);
  const [replyingId, setReplyingId] =
    React.useState<CommentProps["comment"]["id"]>();

  const attachReply: CommentProps["onReply"] = (parentId, comment) => {
    const out = findNestedObj(comments, "id", parentId, comment);
    setComments(out);
    setReplyingId(undefined);
  };

  const deleteComment: CommentProps["onDelete"] = (parentId, comment) => {
    const out = findNestedObj(comments, "id", parentId, comment, true);
    setComments(out);
  };

  return (
    <div className="App">
      {comments.map(
        (comment) =>
          comment && (
            <Comment
              key={comment.id}
              comment={comment}
              onReplyClick={(id) => {
                setReplyingId(id);
              }}
              replyingID={replyingId}
              onReply={attachReply}
              onDelete={deleteComment}
            />
          )
      )}
      {!replyingId && <form
        onSubmit={(ev) => {
          ev.preventDefault();
          const form = new FormData(ev.target as HTMLFormElement);
          const data = form.get("new_comment");
          if (data) {
            setComments((prev) => {
              const updated = [...prev];
              updated.push({
                id: (Math.random() * 100000).toString(),
                comment: data as string,
              });
              (ev.target as HTMLFormElement).reset();
              return updated;
            });
          }
        }}
      >
        <input name="new_comment" />
        <input type="submit" value="submit" />
      </form>}
    </div>
  );
}

export default App;

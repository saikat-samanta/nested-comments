import React from "react";

export interface CommentProps {
  comment: {
    id: string;
    comment: string;
    replies?: {
      id: CommentProps["comment"]["id"];
      comment: CommentProps["comment"]["comment"];
      replies?: CommentProps["comment"]["replies"];
    }[];
  };
  onReplyClick?: (id?: string) => void;
  onReply?: (parentId: string, val: string) => void;
  onDelete?: (parentId: string, val?: string) => void;
  replyingID?: string;
}

export function Comment({
  comment,
  onReplyClick,
  replyingID,
  onReply,
  onDelete,
}: CommentProps) {
  return (
    <ul>
      <li>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{comment.comment}</span>
        </div>

        {replyingID === comment.id ? (
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              const data = new FormData(ev.target as HTMLFormElement).get(
                "comment"
              );
              if (data) {
                onReply?.(comment.id, data as string);
              }
            }}
          >
            <input name="comment" />
            <input type="submit" value="submit" />
            <button onClick={() => onReplyClick?.()}>Cancel</button>
          </form>
        ) : (
          <>
            <span onClick={() => onReplyClick?.(comment.id)}>reply</span>
            <span>{"  "}</span>
            <span onClick={() => onDelete?.(comment.id, undefined)}>
              Delete
            </span>
          </>
        )}
        {comment.replies?.map(
          (reply) =>
            reply && (
              <Comment
                key={reply.id}
                comment={reply}
                onReplyClick={onReplyClick}
                replyingID={replyingID}
                onReply={onReply}
                onDelete={onDelete}
              />
            )
        )}
      </li>
    </ul>
  );
}

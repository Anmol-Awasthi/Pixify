item={{...post, comments: {count: post?.comments?.length}}}

{post?.comments?.map((comment) => (
  <CommentItem item={comment} key={comment.id} />
))}

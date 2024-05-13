import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { fetchPost, fetchComments } from "../api";
import { AuthContext } from "../context/authContext";
import { addComment as sendPostComment } from "../api";

// Utils
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    // weekday: "long", // "Monday"
    year: "numeric", // "2024"
    month: "numeric", // "April"
    day: "numeric", // "22"
    hour: "numeric", // "12"
    minute: "numeric", // "54"
    // timeZoneName: "short", // "GMT"
  });
}

// Components
const PostContent = ({ post }) => {
  return (
    <div className="post-content-container">
      <h1>{post.title}</h1>
      <h3>
        by {post.user.username} on {formatDate(post.timestamp)}
      </h3>
      <p>{post.text}</p>
    </div>
  );
};

const postComment = async (event, postId) => {
  event.preventDefault();
  // Extract comment text
  const formData = new FormData(event.target);
  const text = formData.get("text");
  // Send to server
  const response = await sendPostComment(postId, text);
  if (response.error) {
    alert("Error posting comment. Please try again later.");
  } else {
    console.log("Comment successfully posted!");
    location.reload();
  }
};

const CommentForm = () => {
  const { postId } = useParams();

  return (
    <div className="comment-form-container">
      <form onSubmit={(event) => postComment(event, postId)}>
        <div className="form-group">
          <label htmlFor="text">Add your comment</label>
          <textarea
            name="text"
            cols="30"
            rows="3"
            placeholder="Your comment here..."
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const Comments = ({ comments }) => {
  const { authenticated } = useContext(AuthContext);

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      {authenticated ? (
        <CommentForm />
      ) : (
        <p>You must be logged in to leave a comment</p>
      )}
      {comments.map((comment) => (
        <div key={comment._id}>
          <hr />
          <div className="comment-card">
            <p>{comment.text}</p>
            <p>
              by {comment.user.username} on {formatDate(comment.timestamp)}{" "}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Page
const Post = () => {
  const { postId } = useParams();

  // Fetch post
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetchPost(postId);
        if (response.error) {
          console.error("Error fetching single post with response...");
          console.error(response);
          setPostError(response.error);
        } else {
          setPost(response.post);
        }
      } catch (err) {
        setPostError(err);
      }
      setPostLoading(false);
    }
    getPost();
  }, [postId]);

  // Fetch comments
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  useEffect(() => {
    async function getComments() {
      try {
        const response = await fetchComments(postId);
        if (response.error) {
          console.error("Error fetching comments with response...");
          console.error(response);
          setCommentsError(response.error);
        } else {
          setComments(response.comments);
        }
      } catch (err) {
        setCommentsError(err);
      }
      setCommentsLoading(false);
    }
    getComments();
  }, [postId]);

  // Render
  if (postLoading) {
    return <h1>Loading Post...</h1>;
  }

  if (postError) {
    return <h1>Error Loading Post: {postError.message}</h1>;
  }

  return (
    <>
      <PostContent post={post} />
      <Comments comments={comments} />
    </>
  );
};

export default Post;

import { useState, useEffect } from "react";
import { fetchPosts } from "../api";

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    // weekday: "long", // "Monday"
    year: "numeric", // "2024"
    month: "long", // "April"
    day: "numeric", // "22"
    // hour: "numeric", // "12"
    // minute: "numeric", // "54"
    // timeZoneName: "short", // "GMT"
  });
}

const PostCard = ({ post }) => {
  const publishClass = post.isPublished ? "" : " not-published";
  return (
    <a href={"/posts/" + post._id}>
      <div className={"post-card" + publishClass}>
        <h3>{post.title}</h3>
        <p>{formatDate(post.timestamp)}</p>
      </div>
    </a>
  );
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetchPosts();
        if (response.error) {
          console.error("Error fetching posts with response...");
          console.error(response);
          setError(response.error);
        } else {
          setPosts(response.posts);
        }
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    }
    getPosts();
  }, []);

  if (loading) {
    return <h1>Loading posts...</h1>;
  }

  if (error) {
    return <h1>Error loading blog posts</h1>;
  }

  return (
    <>
      <h1>Actions</h1>
      <div className="actions-container">
        <a href="/posts/create">
          <span>Add Post</span>
        </a>
      </div>
      <hr />
      <h1>Edit Blog Posts</h1>
      <div className="post-card-container">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Home;

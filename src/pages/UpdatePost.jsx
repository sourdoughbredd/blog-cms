import { useState, useContext, useEffect } from "react";
import { fetchPost, updatePost } from "../api";
import { AuthContext } from "../context/authContext";
import { useParams } from "react-router-dom";

const UpdatePost = () => {
  const { postId } = useParams();
  const { authenticated } = useContext(AuthContext);
  // Initialize form data
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    isPublished: false,
  });

  // Fetch post and fill out form data
  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetchPost(postId);
        if (response.error) {
          console.error("Error fetching single post with response...");
          console.error(response);
        } else {
          // SUCCESS
          const newFormData = {
            title: response.post.title,
            text: response.post.text,
            isPublished: response.post.isPublished,
          };
          setFormData(newFormData);
        }
      } catch (err) {
        console.err(err);
      }
    }
    getPost();
  }, [postId]);

  const handleChange = (event) => {
    const { name, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await updatePost(
        postId,
        formData.title,
        formData.text,
        formData.isPublished // Updated property name in API call
      );
      if (response.error) {
        if (response.error.code === 401) {
          alert("Error updating post. Must be logged in as an Author!");
        } else {
          console.log("Error updating post with response...");
          console.error(response);
          alert("Error updating post. Check console for details.");
        }
      } else {
        console.log(response.post);
        alert("Successfully updated post! Press ok to see it.");
        window.location.href = "/posts/" + response.post._id;
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!authenticated) {
    return (
      <>
        <h1>Update Post</h1>
        <h3>You must be logged in as an Author to update posts.</h3>
      </>
    );
  }

  return (
    <>
      <h1>Update Post</h1>
      <h3>
        You will see this page if you are logged in, but you will not be able to
        update a post without author privileges.
      </h3>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Text</label>
          <textarea
            type="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            maxLength={12000}
          />
        </div>
        <div className="form-group checkbox-group">
          <label htmlFor="isPublished">Publish?</label>
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Post</button>
      </form>
    </>
  );
};

export default UpdatePost;

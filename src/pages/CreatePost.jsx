import { useState, useContext } from "react";
import { createPost } from "../api";
import { AuthContext } from "../context/authContext";

const CreatePost = () => {
  const { authenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    isPublished: false, // Updated property name
  });

  console.log("Add Post page authenticated status: " + authenticated);

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
      const response = await createPost(
        formData.title,
        formData.text,
        formData.isPublished // Updated property name in API call
      );
      if (response.error) {
        if (response.error.code === 401) {
          alert("Error adding post. Must be logged in as an Author!");
        } else {
          console.log("Error adding post with response...");
          console.error(response);
          alert("Error adding post. Check console for details.");
        }
      } else {
        alert("Successfully added post! Press ok to see it.");
        window.location.href = "/posts/" + response.post._id;
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!authenticated) {
    return (
      <>
        <h1>Add Post</h1>
        <h3>You must be logged in as an Author to add posts.</h3>
      </>
    );
  }

  return (
    <>
      <h1>Add Post</h1>
      <h3>
        You will see this page if you are logged in, but you will not be able to
        create a post without author privileges.
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
        <button type="submit">Post</button>
      </form>
    </>
  );
};

export default CreatePost;

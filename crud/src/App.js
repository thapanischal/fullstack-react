import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [article, setArticles] = useState([]);
  const [editArticleData, setEditArticleData] = useState(null);



  useEffect(() => {
    const fetchArticle = async () => {
      let response = await axios.get("http://127.0.0.1:3000/api/v1/articles");
      setArticles(response.data);
    };
    fetchArticle();
  }, []);

  const deleteArticle = async (id) => {
    await axios
      .delete(`http://127.0.0.1:3000/api/v1/articles/${id}`, {
        "Content-Type": "application/json",
      })

      .then(() => {
        setArticles((article) => article.filter((article) => article.id !== id));
      })
      .catch((error) => {
        console.error("There Was an Error in Deleting The Article", error.response || error);
      });
  };

  const editArticle = (article) => {
    setEditArticleData(article);
    setTitle(article.title);
    setBody(article.body);
    setAuthor(article.author);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editArticleData) {
      await updateArticle(editArticleData.id, title, body, author);
    } else {
      await addArticle(title, body, author);
    }
    setTitle("");
    setBody("");
    setAuthor("");

  }

  const updateArticle = async (id, title, body, author) => {
    if (title === "" || body === "" || author === "") return null;
    try {
      let response = await axios.put(`http://127.0.0.1:3000/api/v1/articles/${id}`, {
        title: title,
        body: body,
        author: author
      });
      setArticles((prevArticle) =>
        prevArticle.map((article) => (article.id === id ? { ...article, ...response.data } : article)))
    } catch (error) {
      console.error("Error Creating The Article", error.response || error);
    }
  }


  const addArticle = async () => {
    if (title === "" || body === "" || author === "") return null;
    try {
      let response = await axios.post("http://127.0.0.1:3000/api/v1/articles", {
        title: title,
        body: body,
        author: author,
      });
      setArticles((article) => [response.data, ...article]);
    } catch (error) {
      console.error("Error Creating The Article", error.response || error);
    }
  };





  return (<div>
    <h2>Create/Edit an Article</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title :</label>
        <input type='text' name="title" onChange={(e) => setTitle(e.target.value)} value={title} />
      </div>
      <div>
        <label>Body :</label>
        <input type='text' name="body" onChange={(e) => setBody(e.target.value)} value={body} />
      </div>
      <div>
        <label>Author :</label>
        <input type='text' name="author" onChange={(e) => setAuthor(e.target.value)} value={author} />
      </div>
      <button type='submit'>{editArticleData ? "Update Article" : "Create Article"}  </button>
    </form>
    <ul>
      {article.map((article, index) => (
        <li key={index}>
          <h3>{article.title}</h3>
          <h3>{article.body}</h3>
          <h3>{article.author}</h3>
          <button onClick={() => deleteArticle(article.id)}>Delete</button>
          <button onClick={() => editArticle(article)}>Edit</button>
        </li>
      ))}
    </ul>
  </div>

  );
}

export default App;

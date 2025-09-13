import React, { useState } from "react";
import "./LibraryManagementSystem.css";

function LibraryManagementSystem() {
  // Dummy login system
  const [role, setRole] = useState(""); // "admin" or "user"
  const [loggedIn, setLoggedIn] = useState(false);

  // Books state
  const [books, setBooks] = useState([]);

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Login handler
  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setLoggedIn(true);
  };

  // Validation: check duplicates
  const isDuplicate = (newTitle, newAuthor, ignoreIndex = null) => {
    return books.some(
      (book, index) =>
        index !== ignoreIndex &&
        book.title.toLowerCase() === newTitle.toLowerCase() &&
        book.author.toLowerCase() === newAuthor.toLowerCase()
    );
  };

  // Add or Update book
  const handleAddOrUpdateBook = () => {
    if (!title.trim() || !author.trim()) {
      alert("Both Title and Author are required.");
      return;
    }

    if (editIndex === null) {
      // Add book
      if (isDuplicate(title, author)) {
        alert("This book already exists.");
        return;
      }
      setBooks([...books, { title, author, available: true }]);
    } else {
      // Update book
      if (isDuplicate(title, author, editIndex)) {
        alert("Duplicate book entry after update.");
        return;
      }
      const updatedBooks = [...books];
      updatedBooks[editIndex] = { ...updatedBooks[editIndex], title, author };
      setBooks(updatedBooks);
      setEditIndex(null);
    }

    setTitle("");
    setAuthor("");
  };

  // Delete book
  const handleDeleteBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  // Borrow book
  const handleBorrowBook = (index) => {
    const updatedBooks = [...books];
    if (!updatedBooks[index].available) {
      alert("This book is already borrowed.");
      return;
    }
    updatedBooks[index].available = false;
    setBooks(updatedBooks);
  };

  // Return book
  const handleReturnBook = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index].available = true;
    setBooks(updatedBooks);
  };

  // Edit book
  const handleEditBook = (index) => {
    setTitle(books[index].title);
    setAuthor(books[index].author);
    setEditIndex(index);
  };

  // Logout
  const handleLogout = () => {
    setRole("");
    setLoggedIn(false);
    setBooks([]);
  };

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h2>Library Management System</h2>
        <p>Select your role to continue:</p>
        <button onClick={() => handleLogin("admin")}>Login as Admin</button>
        <button onClick={() => handleLogin("user")}>Login as User</button>
      </div>
    );
  }

  return (
    <div className="library-container">
      <h2>📚 Library Management System</h2>
      <p>Logged in as: <strong>{role}</strong></p>
      <button className="logout" onClick={handleLogout}>Logout</button>

      {role === "admin" && (
        <div className="form-container">
          <h3>{editIndex === null ? "Add a Book" : "Update Book"}</h3>
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <button onClick={handleAddOrUpdateBook}>
            {editIndex === null ? "Add Book" : "Update Book"}
          </button>
        </div>
      )}

      <h3>Available Books</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            {role === "admin" && <th>Actions</th>}
            {role === "user" && <th>Borrow/Return</th>}
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="4">No books available.</td>
            </tr>
          ) : (
            books.map((book, index) => (
              <tr key={index}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.available ? "Available" : "Borrowed"}</td>
                {role === "admin" && (
                  <td>
                    <button onClick={() => handleEditBook(index)}>Edit</button>
                    <button onClick={() => handleDeleteBook(index)}>Delete</button>
                  </td>
                )}
                {role === "user" && (
                  <td>
                    {book.available ? (
                      <button onClick={() => handleBorrowBook(index)}>Borrow</button>
                    ) : (
                      <button onClick={() => handleReturnBook(index)}>Return</button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LibraryManagementSystem;

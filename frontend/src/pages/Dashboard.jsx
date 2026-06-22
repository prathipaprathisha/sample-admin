import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "products") {
      fetchCategories();
      fetchProducts();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchUsers();
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers(token);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.deleteUser(id, token);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openUserForm = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
      });
    } else {
      setEditingUser(null);
      setUserForm({ name: "", email: "", password: "", role: "user" });
    }
    setIsUserFormOpen(true);
  };

  const closeUserForm = () => {
    setIsUserFormOpen(false);
    setEditingUser(null);
    setUserForm({ name: "", email: "", password: "", role: "user" });
  };

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser._id, userForm, token);
      } else {
        await api.createUser(userForm, token);
      }
      closeUserForm();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEditUser = (user) => {
    openUserForm(user);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.deleteCategory(id, token);
      fetchCategories();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.deleteProduct(id, token);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const openCategoryForm = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name || "",
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "" });
    }
    setIsCategoryFormOpen(true);
  };

  const closeCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "" });
  };

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory._id, categoryForm, token);
      } else {
        await api.createCategory(categoryForm, token);
      }
      closeCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEditCategory = (category) => {
    openCategoryForm(category);
  };

  const openProductForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        category: product.category?._id || "",
        image: product.image || "",
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: categories[0]?._id || "",
        image: "",
      });
    }
    setIsProductFormOpen(true);
  };

  const closeProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
    setProductForm({ name: "", description: "", price: "", stock: "", category: "", image: "" });
  };

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price) || 0,
        stock: Number(productForm.stock) || 0,
        category: productForm.category,
        image: productForm.image,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload, token);
      } else {
        await api.createProduct(payload, token);
      }
      closeProductForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEditProduct = (product) => {
    openProductForm(product);
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h2>Admin Panel</h2>
          <div>
            <span>Welcome, {user?.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li>
              <button
                className={activeTab === "overview" ? "active" : ""}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
            </li>
            <li>
              <button
                className={activeTab === "categories" ? "active" : ""}
                onClick={() => setActiveTab("categories")}
              >
                Categories
              </button>
            </li>
            <li>
              <button
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {activeTab === "overview" && (
            <div className="tab-content">
              <h3>Dashboard Overview</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Users</h4>
                  <p className="stat-number">{users.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Categories</h4>
                  <p className="stat-number">{categories.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Products</h4>
                  <p className="stat-number">{products.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Users Management</h3>
                <button className="btn-primary" onClick={() => openUserForm()}>
                  Add User
                </button>
              </div>

              {isUserFormOpen && (
                <form className="entity-form" onSubmit={handleUserSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={userForm.name}
                        onChange={handleUserChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userForm.email}
                        onChange={handleUserChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Password {editingUser && "(leave empty to keep current)"}</label>
                      <input
                        type="password"
                        name="password"
                        value={userForm.password}
                        onChange={handleUserChange}
                        required={!editingUser}
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select
                        name="role"
                        value={userForm.role}
                        onChange={handleUserChange}
                        required
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editingUser ? "Update User" : "Create User"}
                    </button>
                    <button type="button" className="btn-secondary" onClick={closeUserForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td className="action-cell">
                          <button className="btn-edit" onClick={() => handleEditUser(u)}>
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "categories" && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Categories Management</h3>
                <button className="btn-primary" onClick={() => openCategoryForm()}>
                  Add Category
                </button>
              </div>

              {isCategoryFormOpen && (
                <form className="entity-form" onSubmit={handleCategorySubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={categoryForm.name}
                      onChange={handleCategoryChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={categoryForm.description}
                      onChange={handleCategoryChange}
                      rows={3}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editingCategory ? "Update Category" : "Create Category"}
                    </button>
                    <button type="button" className="btn-secondary" onClick={closeCategoryForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>{c.description}</td>
                        <td className="action-cell">
                          <button className="btn-edit" onClick={() => handleEditCategory(c)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteCategory(c._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "products" && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Products Management</h3>
                <button className="btn-primary" onClick={() => openProductForm()}>
                  Add Product
                </button>
              </div>

              {isProductFormOpen && (
                <form className="entity-form" onSubmit={handleProductSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleProductChange}
                        required
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        name="category"
                        value={productForm.category}
                        onChange={handleProductChange}
                        required
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleProductChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductChange}
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={productForm.image}
                      onChange={handleProductChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editingProduct ? "Update Product" : "Create Product"}
                    </button>
                    <button type="button" className="btn-secondary" onClick={closeProductForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>${p.price}</td>
                        <td>{p.category?.name}</td>
                        <td>{p.stock}</td>
                        <td className="action-cell">
                          <button className="btn-edit" onClick={() => handleEditProduct(p)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteProduct(p._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

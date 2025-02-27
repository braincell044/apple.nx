"use client";
import { useRouter } from "next/navigation"; 
import React, { useState, useEffect } from "react";
import axios from "axios";
import "boxicons/css/boxicons.min.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@/styles/page.module.css"; 
import styles from "@/styles/page.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8700/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8700/api/products/${id}`);
      setSelectedProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error.message);
    }
  };

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...storedCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);



  // const handleCheckout = () => {
  //   if (cart.length === 0) {
  //     alert("Your cart is empty!");
  //     return;
  //   }
  
  //   alert("Order placed successfully! 🎉");
    
  //   // Clear the cart
  //   setCart([]);
  
  //   // (Optional) Redirect to order page
  //   // navigate("/order-success");  // Use this if using React Router
  // };
  const router = useRouter();

const handleCheckout = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Order placed successfully! 🎉");

  // Navigate to Order Page
  router.push("/order");

  // Clear the cart
  setCart([]);
};
  

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="px-5 py-5 mx-5">
      {/* Header with Cart */}
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Product List</h1>
        <button onClick={() => setShowCart(!showCart)}>
        <i className="bi fs-1 bi-cart3" style={{ fontSize: "24px", color: "skyblue"}}></i>
        ({cart.length})
        </button>
      </header>

{/* Show Cart */}
{showCart && (
  <div className="cart-container" style={{ border: "1px solid #ddd", padding: "20px" }}>
    <h2>Shopping Cart</h2>
    {cart.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cart.map((item, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "5px" }} 
              />
              <span>{item.name} - ${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <hr />
        <h4>Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</h4>
      </>
    )}
    <button onClick={handleCheckout} className="btn btn-success">
      Checkout
    </button>

    
  </div>
)}



      {/* Show all products */}
      {!selectedProduct && !showCart && (
        
        <div className="productCard" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {products.map((product) => (
            <div
              key={product._id}
              className="product-flex"
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                width: "250px",
                textAlign: "center",
                cursor: "pointer",
              }}
           >
                        <div className={`card ${styles.productCard}`}> 
                        <img src={product.image} className={`card-img-top ${styles.productImage}`} alt={product.name} />
                        </div>
              {/* <img src={product.image} alt={product.name} style={{ width: "100%", height: "auto" }} /> */}
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Ratings:</strong> {product.ratings}⭐</p>
              <button onClick={() => fetchProductDetails(product._id)} className="btn btn-warning">View Details</button>
              <button onClick={() => addToCart(product)} className="btn btn-info mx-2 my-2">add to cart</button>
            </div>
          ))}
        </div>
      )}

      {/* Show single product details */}
      {selectedProduct && (
        <div style={{ border: "1px solid #ddd", padding: "20px", maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
          <button onClick={() => setSelectedProduct(null)} style={{ background: "#ddd", padding: "10px 20px", border: "none", cursor: "pointer", marginBottom: "20px" }} className="btn btn-success">Back to Products</button>
          <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "100%", height: "auto", marginBottom: "20px" }} />
          <h2>{selectedProduct.name}</h2>
          <p>{selectedProduct.description}</p>
          <p><strong>Price:</strong> ${selectedProduct.price}</p>
          <p><strong>Ratings:</strong> {selectedProduct.ratings}⭐</p>
          <button onClick={() => addToCart(selectedProduct)}  className="btn btn-info">Buy Now</button>
        </div>
      )}
    </div>
  );
};

export default   ProductList;


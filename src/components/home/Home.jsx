import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from 'react-toastify';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories([{ id: 0, name: "All" }, ...data]);
    } catch (error) {
      console.log("Error fetching categories: ", error);
      toast.error("Failed to load categories");
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.log("Error fetching products: ", error);
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  const handleCategoryFilter = (categoryName) => {
    setActiveCategory(categoryName);
    if (categoryName === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === categoryName));
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning('Please login to add items to cart');
      return;
    }

    try {
      const cartItem = {
        ...product,
        quantity: 1
      };

      const response = await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ButtonGroup className="shadow-sm">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.name ? "primary" : "outline-primary"}
                  onClick={() => handleCategoryFilter(category.name)}
                  className="px-4 py-2"
                  style={{
                    transition: 'all 0.3s ease',
                    border: 'none',
                    borderRadius: '20px',
                    margin: '0 5px'
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </ButtonGroup>
          )}
        </Col>
      </Row>

      <Row className="g-4">
        {loading ? (
          <Col className="text-center">
            <Spinner animation="border" size="lg" />
            <p className="mt-2">Loading products...</p>
          </Col>
        ) : (
          filteredProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm hover-card"
                style={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: 'none',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.title}
                    style={{
                      height: "100%",
                      objectFit: "contain",
                      padding: "15px",
                      transition: 'transform 0.3s ease'
                    }}
                    className="card-img-hover"
                  />
                </div>
                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="fs-6 mb-2" style={{ height: '40px', overflow: 'hidden' }}>
                    {product.title}
                  </Card.Title>
                  <Card.Text className="fw-bold text-primary mb-3">${product.price}</Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="outline-primary"
                      className="w-100 mb-2"
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{
                        borderRadius: '20px',
                        borderWidth: '2px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handleAddToCart(product)}
                      style={{
                        borderRadius: '20px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Home;

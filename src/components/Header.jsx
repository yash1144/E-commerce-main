import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { Container, Nav, Navbar, Button, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaHome } from "react-icons/fa";
import { useState, useEffect } from "react";

function Header() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/cart');
        const data = await response.json();
        setCartCount(data.length);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar expand="lg" className="sticky-top bg-white border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="fw-bold text-gradient">OceanShop</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FaHome className="me-2" />
              Home
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center mx-2">
                  <FaUser className="me-2" />
                  <span className="d-none d-md-inline">{user.displayName || user.email}</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/cart" className="position-relative mx-2">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle rounded-circle"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  onClick={logout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/auth"
                  variant="outline-primary"
                  className="me-2"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/auth?mode=signup"
                  variant="primary"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";

function CartModal({ show, handleClose }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [show]);

  const total = cart.reduce((sum, item) => sum + (item.price * 85), 0);

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <FaShoppingCart className="me-2" />
          Your Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        {cart.length > 0 ? (
          <>
            <ListGroup className="mb-3">
              {cart.map((item, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center border-0 shadow-sm mb-2 rounded"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '1rem' }}
                    />
                    <div>
                      <span className="fw-medium d-block">{item.title}</span>
                      <small className="text-muted">${item.price.toFixed(2)}</small>
                    </div>
                  </div>
                  <strong>₹{Math.ceil(item.price * 85)}</strong>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0">Total:</h5>
                <small className="text-muted">Including all taxes</small>
              </div>
              <h5 className="mb-0 fw-bold">₹{Math.ceil(total)}</h5>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <FaShoppingCart size={48} className="text-muted mb-3" />
            <p className="mb-4">Your cart is empty</p>
            <Button
              variant="primary"
              as={Link}
              to="/"
              onClick={handleClose}
              className="d-flex align-items-center mx-auto"
            >
              Start Shopping
              <FaArrowRight className="ms-2" />
            </Button>
          </div>
        )}
      </Modal.Body>
      {cart.length > 0 && (
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={handleClose}>
            Continue Shopping
          </Button>
          <Button
            variant="primary"
            as={Link}
            to="/cart"
            onClick={handleClose}
            className="d-flex align-items-center"
          >
            View Cart
            <FaArrowRight className="ms-2" />
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default CartModal;

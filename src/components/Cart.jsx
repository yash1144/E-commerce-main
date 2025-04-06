import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../Auth/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: ''
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:3000/cart');
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart items');
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`http://localhost:3000/cart/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                fetchCart();
                toast.success('Cart updated');
            } else {
                toast.error('Failed to update cart');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update cart');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:3000/cart/${itemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCart();
                toast.success('Item removed from cart');
            } else {
                toast.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const handlePayment = async () => {
        if (!user) {
            toast.warning('Please login to proceed with payment');
            return;
        }

        try {
            const order = {
                userId: user.uid,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                date: new Date().toISOString(),
                status: 'completed'
            };

            const orderResponse = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });

            if (orderResponse.ok) {
                await Promise.all(
                    cart.map(item =>
                        fetch(`http://localhost:3000/cart/${item.id}`, {
                            method: 'DELETE',
                        })
                    )
                );

                setShowPaymentModal(false);
                fetchCart();
                toast.success('Payment successful! Thank you for your purchase.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Error processing payment. Please try again.');
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <Container className="py-5">
            <div className="d-flex align-items-center mb-4">
                <Link to="/" className="text-decoration-none">
                    <Button variant="outline-primary" className="me-3">
                        <FaArrowLeft className="me-2" />
                        Continue Shopping
                    </Button>
                </Link>
                <h2 className="mb-0 text-gradient">Shopping Cart</h2>
            </div>

            {cart.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5">
                        <h4 className="mb-4">Your cart is empty</h4>
                        <Button variant="primary" as={Link} to="/">
                            Start Shopping
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    <ListGroup className="mb-4">
                        {cart.map((item) => (
                            <ListGroup.Item key={item.id} className="border-0 shadow-sm mb-3 rounded">
                                <Row className="align-items-center py-3">
                                    <Col md={2}>
                                        <div className="product-image-container">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="product-image"
                                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <h5 className="mb-1">{item.title}</h5>
                                        <p className="text-muted mb-0">${item.price.toFixed(2)}</p>
                                    </Col>
                                    <Col md={3}>
                                        <div className="d-flex align-items-center">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="rounded-circle"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <FaMinus />
                                            </Button>
                                            <span className="mx-3 fw-bold">{item.quantity}</span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="rounded-circle"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <p className="mb-0 fw-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="rounded-circle"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="mb-0">Total: ${total.toFixed(2)}</h4>
                                    <small className="text-muted">Including all taxes</small>
                                </div>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => setShowPaymentModal(true)}
                                    className="px-4 d-flex align-items-center"
                                >
                                    <FaCreditCard className="me-2" />
                                    Proceed to Payment
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
                        <Modal.Header closeButton className="border-0">
                            <Modal.Title className="fw-bold">Payment Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="px-4">
                            <Form>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Card Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                        className="py-3"
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Expiry Date</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="MM/YY"
                                                value={paymentDetails.expiryDate}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                                                className="py-3"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">CVV</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="123"
                                                value={paymentDetails.cvv}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                                className="py-3"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Cardholder Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="John Doe"
                                        value={paymentDetails.name}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                                        className="py-3"
                                        required
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                            <Button variant="outline-secondary" onClick={() => setShowPaymentModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handlePayment}>
                                Pay ${total.toFixed(2)}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </Container>
    );
};

export default Cart; 
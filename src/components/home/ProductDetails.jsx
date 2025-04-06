import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, InputGroup, Form } from "react-bootstrap";
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import ReviewSystem from "../ReviewSystem";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from 'react-toastify';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItem, setCartItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/${id}`);
                const data = await response.json();
                setProduct(data);
                fetchRelatedProducts(data.category, data.id);
                checkIfInCart(data.id);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        const checkIfInCart = async (productId) => {
            try {
                const response = await fetch(`http://localhost:3000/cart?productId=${productId}`);
                const data = await response.json();
                if (data.length > 0) {
                    setCartItem(data[0]);
                    setQuantity(data[0].quantity);
                }
            } catch (error) {
                console.error('Error checking cart:', error);
            }
        };

        const fetchRelatedProducts = async (category, currentProductId) => {
            try {
                const response = await fetch(`http://localhost:3000/products?category=${category}`);
                const data = await response.json();
                setRelatedProducts(
                    data
                        .filter(product => product.id !== currentProductId)
                        .slice(0, 4)
                );
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchProduct();
    }, [id]);

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
                const newCartItem = await response.json();
                setCartItem(newCartItem);
                setQuantity(1);
                toast.success('Added to cart!');
            } else {
                toast.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    const handleUpdateQuantity = async (newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`http://localhost:3000/cart/${cartItem.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                const updatedItem = await response.json();
                setCartItem(updatedItem);
                setQuantity(newQuantity);
                toast.success('Cart updated!');
            } else {
                toast.error('Failed to update cart');
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Failed to update cart');
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" size="lg" />
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="text-center py-5">
                <h2>Product not found</h2>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Button
                variant="outline-secondary"
                className="mb-4"
                onClick={() => navigate('/')}
                style={{
                    borderRadius: '20px',
                    padding: '8px 20px',
                    transition: 'all 0.3s ease'
                }}
            >
                <FaArrowLeft className="me-2" />
                Back to Home
            </Button>

            <Row className="mb-4">
                <Col md={5} className="d-flex justify-content-center">
                    <div className="product-image-container" style={{
                        width: '100%',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <img
                            src={product.image}
                            alt={product.title}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                transition: 'transform 0.3s ease'
                            }}
                            className="product-image"
                        />
                    </div>
                </Col>
                <Col md={7}>
                    <div className="product-details" style={{
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '15px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 className="mb-3" style={{ color: '#2c3e50' }}>{product.title}</h2>
                        <h4 className="text-primary mb-4" style={{ fontSize: '1.8rem' }}>${product.price}</h4>
                        <p className="mb-4" style={{ color: '#666', lineHeight: '1.6' }}>{product.description}</p>
                        <p className="mb-4">
                            <strong style={{ color: '#2c3e50' }}>Category:</strong>
                            <span style={{
                                backgroundColor: '#e9ecef',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                marginLeft: '10px'
                            }}>
                                {product.category}
                            </span>
                        </p>

                        {cartItem ? (
                            <div className="mb-4">
                                <InputGroup style={{ width: '150px' }}>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => handleUpdateQuantity(quantity - 1)}
                                        style={{
                                            borderTopLeftRadius: '20px',
                                            borderBottomLeftRadius: '20px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <FaMinus />
                                    </Button>
                                    <Form.Control
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleUpdateQuantity(parseInt(e.target.value))}
                                        min="1"
                                        className="text-center"
                                        style={{
                                            border: '1px solid #dee2e6',
                                            borderLeft: 'none',
                                            borderRight: 'none'
                                        }}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => handleUpdateQuantity(quantity + 1)}
                                        style={{
                                            borderTopRightRadius: '20px',
                                            borderBottomRightRadius: '20px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <FaPlus />
                                    </Button>
                                </InputGroup>
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => handleAddToCart(product)}
                                className="mb-4"
                                style={{
                                    borderRadius: '20px',
                                    padding: '10px 30px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <FaShoppingCart className="me-2" />
                                Add to Cart
                            </Button>
                        )}

                        <ReviewSystem productId={product.id} />
                    </div>
                </Col>
            </Row>

            <div className="mt-5">
                <h3 className="mb-4" style={{ color: '#2c3e50' }}>Related Products</h3>
                <Row className="g-4">
                    {relatedProducts.map((relatedProduct) => (
                        <Col key={relatedProduct.id} xs={12} sm={6} md={4} lg={3}>
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
                                        src={relatedProduct.image}
                                        alt={relatedProduct.title}
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
                                        {relatedProduct.title}
                                    </Card.Title>
                                    <Card.Text className="fw-bold text-primary mb-3">${relatedProduct.price}</Card.Text>
                                    <div className="mt-auto">
                                        <Button
                                            variant="outline-primary"
                                            className="w-100"
                                            onClick={() => navigate(`/product/${relatedProduct.id}`)}
                                            style={{
                                                borderRadius: '20px',
                                                borderWidth: '2px',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
}

export default ProductDetails; 
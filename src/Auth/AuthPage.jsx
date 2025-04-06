import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import useAuth
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";

function AuthPage() {
  const { updateUserProfile } = useAuth(); // Get updateUserProfile from context
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [inputError, setInputError] = useState({ email: false, password: false, confirmPassword: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInputError({ email: false, password: false, confirmPassword: false });

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setInputError({ ...inputError, password: true, confirmPassword: true });
          setPassword("");
          setConfirmPassword("");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await updateUserProfile(userName);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      setError(error.message);
      setInputError({ email: true, password: true });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "400px" }} className="shadow p-4">
        <h3 className="text-center">{isSignUp ? "Sign Up" : "Login"}</h3>
        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter your Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className={inputError.email ? "border-danger" : ""}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              className={inputError.password ? "border-danger" : ""}
            />
          </Form.Group>

          {isSignUp && (
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputError.confirmPassword ? "border-danger" : ""}
              />
            </Form.Group>
          )}

          {error && <p className="text-danger text-center">{error}</p>}

          <Button variant="primary" type="submit" className="w-100">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <Button variant="danger" className="w-100 mt-2" onClick={() => signInWithPopup(auth, googleProvider)}>
            Sign in with Google
          </Button>
        </Form>

        <Row className="mt-3">
          <Col className="text-center">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsSignUp(false)}>
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsSignUp(true)}>
                  Sign Up
                </span>
              </p>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default AuthPage;

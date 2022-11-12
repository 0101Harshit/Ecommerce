import React, { useEffect, useReducer } from "react";
import axios from "axios";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, products, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Featured Products</h1>
      <Helmet>
        <title>Lets Do Shopping</title>
      </Helmet>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product, index) => {
              return (
                <Col sm={6} md={4} lg={3} className="mb-3" key={index}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;

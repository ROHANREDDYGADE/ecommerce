import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import axios from 'axios';

import actions from '../../actions';
import banners from './banners.json';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';
import ProductList from '../../components/Store/ProductList';

class Homepage extends React.PureComponent {
  state = {
    products: [],  // Store products fetched from the API
  };

  componentDidMount() {
    if (!this.props.products || this.props.products.length === 0) {
      this.props.fetchProducts();
    }
    
    // Fetch products from API
    this.fetchProductsFromAPI();
  }

  fetchProductsFromAPI = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/list', {
        params: {
          name: 'all',
          category: 'all',
          brand: 'all',
          min: 1,
          max: 2500,
          rating: 0,
          order: 0,
          page: 1,
          limit: 10,
          sortOrder: JSON.stringify({ _id: -1 })
        }
      });

      // Update the state with the fetched products
      this.setState({ products: response.data.products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  render() {
    const { products } = this.state;
    const { authenticated, updateWishlist } = this.props;

    return (
      <div className='homepage'>
        {/* Banner Section */}
        <Row className='flex-row'>
          <Col xs='12' lg='6' className='order-lg-2 mb-3 px-3 px-md-2'>
            <div className='home-carousel'>
              <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={false}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img key={index} src={item.imageUrl} alt={`Banner ${index + 1}`} />
                ))}
              </CarouselSlider>
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-1 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-5.jpg' />
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-3 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-6.jpg' />
            </div>
          </Col>
        </Row>

        {/* Products Section */}
        <div className='homepage-products mt-5 px-3'>
          <h2 className='mb-4'>Featured Products</h2>
          <ProductList
            products={products.slice(0, 8)} // Displaying the first 5 products from the fetched list
            authenticated={authenticated}
            updateWishlist={updateWishlist}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.product.storeProducts,
  authenticated: state.authentication.authenticated,
});

export default connect(mapStateToProps, actions)(Homepage);

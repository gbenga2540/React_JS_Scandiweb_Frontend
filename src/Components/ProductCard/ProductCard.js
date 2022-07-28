import React, { Component } from 'react';
import './ProductCard.scss';
import CartIcon from '../../Images/CartWhite.svg';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ProductCard extends Component {

    handleAddtoCart = () => {
        const AddtoCart = () => {
            let CartItem = {};

            CartItem["id"] = this.props.product_info?.id;
            CartItem["brand"] = this.props.product_info?.brand;
            CartItem["name"] = this.props.product_info?.name;
            CartItem["gallery"] = this.props.product_info?.gallery;
            CartItem["prices"] = this.props.product_info?.prices;
            CartItem["inStock"] = this.props.product_info?.inStock;
            CartItem["quantity"] = 1;

            if (this.props.product_info?.attributes?.length > 0) {
                alert('Product has Attributes. Please, visit the Description Page to add this product to your cart!!!');
            } else {
                this.props.AddtoUserCart(CartItem);
            }
        }
        if (this.props.UserCarts?.length > 0) {
            let ProductInCart = false;
            for (let i = 0; i < this.props.UserCarts?.length; i++) {
                if (this.props.UserCarts[i]?.id === this.props.product_info?.id) {
                    ProductInCart = true;
                    alert('This Product is available in your cart!!!');
                    return;
                }
            }
            if (!ProductInCart) {
                AddtoCart();
            }
        } else {
            AddtoCart();
        }
    }

    handleOpenPDP = () => {
        this.props.history?.push(`/products/${this.props.product_info?.id}`)
    }

    handlePriceBasedOnCurr = () => {
        if (this.props.product_info?.prices.length > 0) {
            const current_currency_symbol = this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol;
            const currency_obj = this.props.product_info?.prices.filter(item => item?.currency?.symbol === current_currency_symbol);
            return currency_obj[0]?.amount;
        }
    }

    render() {
        return (
            <section className='productcard_main'>
                <div
                    className='pc_m_oos'
                    id={this.props.product_info?.inStock ? '' : 'pc_m_oos'}
                    onClick={this.handleOpenPDP}
                >
                    <p>OUT OF STOCK</p>
                </div>
                <div
                    className={this.props.product_info?.inStock ? 'pc_m_cart' : 'pc_m_cart_dn'}
                    onClick={this.handleAddtoCart}>
                    <img
                        src={CartIcon}
                        alt='add'
                    />
                </div>
                {this.props.product_info?.gallery[0].includes("http") && this.props.product_info?.gallery[0].length > 30 ?
                    <img
                        src={this.props.product_info?.gallery[0]}
                        alt='product'
                        className='pc_m_img'
                        id={this.props.product_info?.inStock ? '' : 'pc_m_img'}
                        onClick={this.handleOpenPDP}
                    /> : <div className='pc_m_img'></div>
                }
                <div className='pc_m_desc'>
                    <div
                        className='pc_m_ep'
                        onClick={this.handleOpenPDP}
                    ></div>
                    <p
                        className='pc_m_bname'
                        id={this.props.product_info?.inStock ? '' : 'pc_m_bname'}
                        onClick={this.handleOpenPDP}
                    >{`${this.props.product_info?.brand} ${this.props.product_info?.name}`}</p>
                    <p
                        className='pc_m_bname pc_m_price'
                        id={this.props.product_info?.inStock ? '' : 'pc_m_bname'}
                        onClick={this.handleOpenPDP}
                    >
                        {this.props.AllCurrencies?.length > 0 ?
                            this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol : ''
                        }
                        {this.handlePriceBasedOnCurr()}
                    </p>
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        CurrentCurrency: state.CurrentCurrency,
        AllCurrencies: state.AllCurrencies,
        UserCarts: state.UserCarts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        AddtoUserCart: (item) => dispatch({ type: "USER_CARTS", payload: item }),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCard));

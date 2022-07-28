import React, { Component } from 'react';
import './DescriptionPage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { GET_PRODUCT_BY_ID } from '../../GraphQL/Queries';
import parse from "html-react-parser";
import { back_end_endpoint } from '../../Configs/BackEndEndpoint';

class DescriptionPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            price: '',
            galleryIndex: 0,
            productAttribs: {},
            ViewMoreDesc: false,
            loading: true,
            error: false
        }
    }

    getdata = async () => {
        await fetch(back_end_endpoint(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "operationName": GET_PRODUCT_BY_ID({ ProductID: this.props.match?.params?.id }).operationName,
                "query": GET_PRODUCT_BY_ID({ ProductID: this.props.match?.params?.id }).query,
                "variables": {}
            })
        })
            .catch(error => {
                console.log(error);
                this.setState({ error: true });
            })
            .then(async (res) => {
                const json_data = await res.json();
                const raw_data = json_data?.data?.product;
                this.props.SetCurrentProduct(raw_data);
                if (raw_data) {
                    this.setState({ error: false, loading: false });
                } else {
                    this.setState({ loading: true });
                }
            })
    }

    setProductAttributes = (attrib_name, attrib_value) => {
        let prevState = this.state.productAttribs;
        prevState[attrib_name] = attrib_value;
        this.setState({ productAttribs: { ...prevState } });

        let cartIndex = 0;
        let isProductInCart = false;
        for (let i = 0; i < this.props.UserCarts?.length; i++) {
            if (this.props.UserCarts[i]?.id === this.props.CurrentProduct?.id) {
                cartIndex = i;
                isProductInCart = true;
                break;
            } else {
                isProductInCart = false;
            }
        }

        if (isProductInCart) {
            const prevData = this.props.UserCarts[cartIndex];
            const newData = {
                ...prevData
            };
            newData[attrib_name] = attrib_value;
            this.props.UpdateUserCart(cartIndex, { ...newData });
        }
    }

    handlePriceBasedOnCurr = () => {
        if (this.props.CurrentProduct?.prices?.length > 0) {
            const current_currency_symbol = this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol;
            const currency_obj = this.props.CurrentProduct?.prices?.filter(item => item?.currency?.symbol === current_currency_symbol);
            this.setState({ price: currency_obj[0]?.amount });
        }
    }

    handleAddtoCart = () => {
        const AddtoCart = () => {
            let CartItem = {};

            CartItem["id"] = this.props.CurrentProduct?.id;
            CartItem["brand"] = this.props.CurrentProduct?.brand;
            CartItem["name"] = this.props.CurrentProduct?.name;
            CartItem["gallery"] = this.props.CurrentProduct?.gallery;
            CartItem["prices"] = this.props.CurrentProduct?.prices;
            CartItem["inStock"] = this.props.CurrentProduct?.inStock;
            CartItem["attributes"] = this.props.CurrentProduct?.attributes;
            CartItem["quantity"] = 1;

            if (this.props.CurrentProduct?.attributes?.length > 0) {
                for (let i = 0; i < this.props.CurrentProduct?.attributes?.length; i++) {
                    CartItem[this.props.CurrentProduct?.attributes[i]?.id] = this.state.productAttribs[this.props.CurrentProduct?.attributes[i]?.id] === undefined ?
                        this.props.CurrentProduct?.attributes[i]?.items[0]?.value :
                        this.state.productAttribs[this.props.CurrentProduct?.attributes[i]?.id];
                }
                this.props.AddtoUserCart(CartItem);
            } else {
                this.props.AddtoUserCart(CartItem);
            }
        }

        if (this.props.UserCarts?.length > 0) {
            let ProductInCart = false;
            for (let i = 0; i < this.props.UserCarts?.length; i++) {
                if (this.props.UserCarts[i]?.id === this.props.CurrentProduct?.id) {
                    ProductInCart = true;
                    alert(`This Product is available in your cart, changes to the product's attributes are updated automatically...`);
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

    componentDidMount = () => {
        document.title = 'Scandiweb Dev Test | Description';
        this.setState({ error: false });
        this.props.ClearCurrentProduct();
        this.getdata();
        this.setState({ productAttribs: {} });
        this.handlePriceBasedOnCurr();
        window.scrollTo(0, 0);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.match?.params?.id !== this.props.match?.params?.id) {
            this.setState({ error: false });
            this.props.ClearCurrentProduct();
            this.getdata();
            this.setState({ productAttribs: {} });
            this.handlePriceBasedOnCurr();
            window.scrollTo(0, 0);
        }
        if (this.props.CurrentCurrency !== prevProps.CurrentCurrency) {
            this.setState({ error: false });
            this.handlePriceBasedOnCurr();
        }
    }

    render() {
        return (
            <main
                className='descpage_main'
                onClick={this.props.handle_CloseCartOrCurr}
            >
                <div
                    className='dp_m_fade'
                    id={this.props.openMiniCartOverlay ? 'dp_m_fade' : ''}
                ></div>
                {!this.state.loading &&
                    <div className='dp_m_w'>
                        <div className='dp_m_1'>
                            <div className='dp_m_1_ia'>
                                {this.props.CurrentProduct?.gallery?.length > 0 &&
                                    this.props.CurrentProduct?.gallery?.map((item, i) =>
                                        <img
                                            key={i}
                                            src={item}
                                            alt='prev'
                                            onClick={() => this.setState({ galleryIndex: i })}
                                        />
                                    )
                                }
                            </div>
                            {this.props.CurrentProduct?.gallery?.length > 0 &&
                                <img
                                    className='dp_m_1_ci'
                                    src={this.props.CurrentProduct?.gallery[this.state.galleryIndex]}
                                    alt='product_image' />
                            }
                        </div>
                        <div className='dp_m_2'>
                            <h1 className='dp_m_2_b'>{this.props.CurrentProduct?.brand}</h1>
                            <p className='dp_m_2_n'>{this.props.CurrentProduct?.name}</p>
                            {this.props.CurrentProduct?.attributes?.length > 0 &&
                                this.props.CurrentProduct?.attributes?.map((item, i) =>
                                    <div key={i} className='dp_m_1_a_w'>
                                        <p className='dp_m_2_p'>{`${item?.name}:`}</p>
                                        <div className='dp_m_1_a_w_b'>
                                            {item?.type === "text" &&
                                                item?.items?.length > 0 &&
                                                item?.items?.map((values, index) =>
                                                    <h3
                                                        key={index}
                                                        id={values?.value === (this.props.UserCarts?.filter(data => data.id === this.props.CurrentProduct?.id)?.length > 0 ?
                                                            this.props.UserCarts?.filter(data => data.id === this.props.CurrentProduct?.id)?.[0][item?.name] :
                                                            (this.state.productAttribs[item?.id] === undefined ?
                                                                item?.items[0]?.value :
                                                                this.state.productAttribs[item?.id]
                                                            )) ? 'h3' : ''
                                                        }
                                                        onClick={() => this.setProductAttributes(item?.id, values?.value)}
                                                    >{values?.value}</h3>
                                                )
                                            }
                                            {item?.type === "swatch" &&
                                                item?.items?.length > 0 &&
                                                item?.items?.map((values, index) =>
                                                    <span
                                                        key={index}
                                                        id={values?.value === (this.props.UserCarts?.filter(data => data.id === this.props.CurrentProduct?.id)?.length > 0 ?
                                                            this.props.UserCarts?.filter(data => data.id === this.props.CurrentProduct?.id)?.[0][item?.name] :
                                                            (this.state.productAttribs[item?.id] === undefined ?
                                                                item?.items[0]?.value :
                                                                this.state.productAttribs[item?.id]
                                                            )) ? 'span' : ''
                                                        }
                                                        onClick={() => this.setProductAttributes(item?.id, values?.value)}
                                                    >
                                                        <div style={{ backgroundColor: values?.value }}></div>
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </div>
                                )}
                            <p className='dp_m_2_p'>PRICE:</p>
                            <p className='dp_m_2_c'>{`${this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol}${this.state.price}`}</p>
                            <button
                                disabled={!this.props.CurrentProduct?.inStock}
                                onClick={this.handleAddtoCart}
                                className='dp_m_2_btn'
                            >
                                {!this.props.CurrentProduct?.inStock ?
                                    `OUT OF STOCK` :
                                    `${this.props.UserCarts?.filter(data => data?.id === this.props.CurrentProduct?.id)?.length === 1 ?
                                        "AVAILABLE IN CART" :
                                        'ADD TO CART'
                                    }`
                                }</button>
                            <div className='dp_m_2_desc'>
                                {this.props.CurrentProduct?.description?.length > 200 ?
                                    parse(`${this.state.ViewMoreDesc ?
                                        this.props.CurrentProduct?.description :
                                        this.props.CurrentProduct?.description?.slice(0, 200)}
                                ${this.state.ViewMoreDesc ? '' : '...'}`) :
                                    parse(`${this.props.CurrentProduct?.description}`)
                                }
                            </div>
                            {this.props.CurrentProduct?.description?.length > 200 &&
                                <button
                                    className='dp_m_2_btn_vm'
                                    onClick={() => this.setState({ ViewMoreDesc: !this.state.ViewMoreDesc })}
                                >View {this.state.ViewMoreDesc ? 'Less' : 'More'}</button>
                            }
                        </div>
                    </div>
                }
                {this.state.loading && !this.state.error &&
                    <p className='dp_m_loading'>Loading Product Description...</p>
                }
                {this.state.error &&
                    <p
                        className='dp_m_loading'
                        style={{ color: 'red' }}
                    >Error Loading Product Description...</p>
                }
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        CurrentCurrency: state.CurrentCurrency,
        AllCurrencies: state.AllCurrencies,
        UserCarts: state.UserCarts,
        CurrentProduct: state.CurrentProduct
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        AddtoUserCart: (item) => dispatch({ type: "USER_CARTS", payload: item }),
        SetCurrentProduct: (product) => dispatch({ type: "SET_CURRENT_PRODUCT", payload: product }),
        ClearCurrentProduct: () => dispatch({ type: "CLEAR_CURRENT_PRODUCT" }),
        UpdateUserCart: (index, data) => dispatch({ type: "UPDATE_USER_CARTS", product_index: index, product_data: data })
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DescriptionPage));

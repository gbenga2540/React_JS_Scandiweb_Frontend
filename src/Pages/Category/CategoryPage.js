import React, { Component } from 'react';
import './CategoryPage.scss';
import ArrowLeftBlack from '../../Images/ArrowLeftBlack.png';
import ProductCard from '../../Components/ProductCard/ProductCard';
import { connect } from 'react-redux';
import { GET_CATEGORY_PRODUCTS } from '../../GraphQL/Queries';
import { back_end_endpoint } from '../../Configs/BackEndEndpoint';

class CategoryPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            curr_cat_products: [],
            max_product_per_page: 6,
            p_first_index: 0,
            p_last_index: 6,
            loading: true,
            error: false
        }
    }

    getdata = async () => {
        if (this.props.AllCategories.length > 0) {
            await fetch(back_end_endpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "operationName": GET_CATEGORY_PRODUCTS({ category: this.props.AllCategories[this.props.CurrentCategory] }).operationName,
                    "query": GET_CATEGORY_PRODUCTS({ category: this.props.AllCategories[this.props.CurrentCategory] }).query,
                    "variables": {}
                })
            })
                .catch(error => {
                    console.log(error);
                    this.setState({ error: true });
                })
                .then(async (res) => {
                    const json_data = await res.json();
                    const raw_data = json_data?.data?.category;
                    this.setState({ curr_cat_products: raw_data?.products });
                }).finally(() => {
                    console.log(this.state.curr_cat_products)


                    if (this.state.curr_cat_products?.length > 0) {
                        this.setState({ loading: false, error: false });
                    } else {
                        this.setState({ loading: true });
                    }
                    this.setState({ p_first_index: 0, p_last_index: this.state.max_product_per_page });
                })
        }
    }

    decreaseProductFilter = () => {
        if (this.state.p_first_index > 0) {
            this.setState({ p_first_index: this.state.p_first_index - this.state.max_product_per_page, p_last_index: this.state.p_last_index - this.state.max_product_per_page });
        }
        window.scrollTo(0, 0);
    }

    increaseProductFilter = () => {
        if (this.state.p_last_index < this.state.curr_cat_products?.length) {
            this.setState({ p_first_index: this.state.p_first_index + this.state.max_product_per_page, p_last_index: this.state.p_last_index + this.state.max_product_per_page });
        }
        window.scrollTo(0, 0);
    }

    handle_Update = () => {
        document.title = `Scandiweb Dev Test | ${this.props.AllCategories?.length > 0 && this.props.AllCategories[this.props.CurrentCategory][0]?.toUpperCase()}${this.props.AllCategories?.length > 0 && this.props.AllCategories[this.props.CurrentCategory]?.slice(1).toLowerCase()}`;
        this.getdata();
        window.scrollTo(0, 0);
    }

    componentDidMount = () => {
        this.handle_Update();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.AllCategories !== this.props.AllCategories) {
            this.handle_Update();
        }
        if (prevProps.CurrentCategory !== this.props.CurrentCategory) {
            this.handle_Update();
        }
    }

    render() {
        return (
            <main
                className='categorypage_main'
                onClick={this.props.handle_CloseCartOrCurr}
            >
                <div
                    className='cp_m_fade'
                    id={this.props.openMiniCartOverlay ? 'cp_m_fade' : ''}
                ></div>
                {!this.state.loading && <div>
                    <h1 className='cp_m_h1'>
                        {this.props.AllCategories?.length > 0 &&
                            this.props.AllCategories[this.props.CurrentCategory][0]?.toUpperCase()
                        }
                        {this.props.AllCategories?.length > 0 &&
                            this.props.AllCategories[this.props.CurrentCategory]?.slice(1).toLowerCase()
                        }
                    </h1>
                    <div className='cp_m_product_w'>
                        {this.state.curr_cat_products &&
                            this.state.curr_cat_products?.slice(this.state.p_first_index, this.state.p_last_index)?.map((item, i) =>
                                <ProductCard key={i} product_info={item} />
                            )
                        }
                    </div>
                    <div className='cp_m_pagination'>
                        <img
                            src={ArrowLeftBlack}
                            alt='<'
                            onClick={this.decreaseProductFilter}
                        />
                        <p>{this.state.p_first_index + 1}</p>
                        <p>-</p>
                        <p>{this.state.p_last_index}</p>
                        <img
                            className='cp_m_p_ar'
                            src={ArrowLeftBlack}
                            alt='>'
                            onClick={this.increaseProductFilter}
                        />
                    </div>
                </div>
                }
                {this.state.loading && !this.state.error &&
                    <p className='cp_m_loading'>Loading Products...</p>
                }
                {this.state.error &&
                    <p
                        className='cp_m_loading'
                        style={{ color: 'red' }}
                    >Error Loading Products...</p>
                }
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        AllCategories: state.AllCategories,
        CurrentCategory: state.CurrentCategory
    }
}

export default (connect(mapStateToProps)(CategoryPage));

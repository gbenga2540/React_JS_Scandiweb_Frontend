import React, { Component } from 'react';
import './CurrencySwitcher.scss';
import { connect } from 'react-redux';
import { GET_CURRENCIES } from '../../GraphQL/Queries';
import { back_end_endpoint } from '../../Configs/BackEndEndpoint';

class CurrencySwitcher extends Component {

    getdata = async () => {
        await fetch(back_end_endpoint(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "operationName": GET_CURRENCIES.operationName,
                "query": GET_CURRENCIES.query,
                "variables": {}
            })
        })
            .catch(error => console.log(error))
            .then(async (res) => {
                const json_data = await res.json();
                const raw_data = json_data?.data?.currencies;
                this.props.setAllCurrencies(raw_data);
            })
    }

    componentDidMount = () => {
        this.getdata();
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.CurrentCurrency !== prevProps.CurrentCurrency) {
            this.getdata();
        }
    }

    render() {
        return (
            <section className='currency_switcher_main'>
                {this.props.AllCurrencies?.length > 0 &&
                    this.props.AllCurrencies?.map((item, i) =>
                        <p
                            key={i}
                            className={this.props.CurrentCurrency === i ? 'currency' : ''}
                            onClick={() => {
                                this.props.setCurrentCurrency(i);
                                this.props.handle_CloseCartOrCurr();
                            }}
                        >
                            {`${item?.symbol} ${item?.label}`}
                        </p>
                    )}
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        AllCurrencies: state.AllCurrencies,
        CurrentCurrency: state.CurrentCurrency
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAllCurrencies: (all_currencies) => dispatch({ type: "ALL_CURRENCIES", payload: all_currencies }),
        setCurrentCurrency: (current_currency) => dispatch({ type: "CURRENT_CURRENCY", payload: current_currency })
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(CurrencySwitcher));

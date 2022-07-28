import { combineReducers } from 'redux';
import { curr_category, all_categories } from './Reducers/CategoriesReducer';
import { curr_currency, all_currencies } from './Reducers/CurrenciesReducer';
import { total_carts, total_carts_price, user_carts, total_cart_tax } from './Reducers/CartsReducer';
import { curr_product } from './Reducers/ProductReducer';

const rootReducer = combineReducers({
    CurrentCategory: curr_category,
    AllCategories: all_categories,
    CurrentCurrency: curr_currency,
    AllCurrencies: all_currencies,
    TotalCarts: total_carts,
    TotalCartsPrice: total_carts_price,
    TotalCartsTax: total_cart_tax,
    UserCarts: user_carts,
    CurrentProduct: curr_product
})

export default rootReducer;
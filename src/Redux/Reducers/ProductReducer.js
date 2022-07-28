export const curr_product = (state = {}, action) => {
    switch (action.type) {
        case "SET_CURRENT_PRODUCT":
            return action.payload;
        case "CLEAR_CURRENT_PRODUCT":
            return {};
        default:
            return state;
    }
}
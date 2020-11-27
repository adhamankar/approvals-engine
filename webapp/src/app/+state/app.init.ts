import { App } from './app.state';

export const appInitialState: App = {
    searchParam: {
        offset: 0,
        size: 12,
        rules: [
            ["order_by", "rank", "desc"],
            ["order_by", "create_date", "asc"]
        ]
    },
    searchResults: null,

    category: null,

    filterParam: { offset: 0, size: 16, state: "read", no_result_if_limit: false },
    filterResults: null,

    stockDetails: null
};

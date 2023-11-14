interface Network {
    name: String,
    ethUsdPriceFeedAddress?: String,
    blockConfirmations: number
}

export const networks: {[key: number]: Network} = {
    11155111: {
        name: "Sepolia",
        ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        blockConfirmations: 6,
    },
    137: {
        name: "Polygon",
        ethUsdPriceFeedAddress: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        blockConfirmations: 6,
    },
    // 31337: {
    //     name: "Local",
    //     ethUsdPriceFeedAddress: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    //     blockConfirmations: 6,
    // }
};

export const developmentChains = ["hardhat", "localhost"];

export const DECIMALS = 8;

export const INITIAL_ANSWER = 200000000000

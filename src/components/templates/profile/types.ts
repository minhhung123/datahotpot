export type TNFTItem = {
    contract: string;
    price: string;
    tokenId: number;
    seller: string;
    owner: string;
    name: string;
    context: string;
    sources: string;
    tags: string[];
    itemId: number;
}

export interface IProfile {
    myDataNFTs? : TNFTItem[];
}
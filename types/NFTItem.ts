export type TNFTItem = {
    contract: string;
    contains: string;
    price: string;
    tokenId: number;
    seller: string;
    owner: string;
    name: string;
    context: string;
    sources: string;
    tags: string[];
    itemId: number;
    thumbnailUrl: string;
    sellerAvatar?: string;
    ownerAvatar?: string;
}
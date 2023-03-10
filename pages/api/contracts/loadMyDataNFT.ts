import { ethers } from 'ethers';
import axios from 'axios';
import { datahotpotMarketplaceAddress } from '../../../utils/addresses';
import DataNFT from '../../../abis/DataNFT.json';
import DatahotpotMarketplace from '../../../abis/DatahotpotMarketplace.json';
import { TNFTItem } from '../../../types/NFTItem';

export const loadMyDataNFTs = async (address: string) : Promise<TNFTItem[]> => {
    const provider = new ethers.providers.JsonRpcProvider("https://api.hyperspace.node.glif.io/rpc/v1");
    const marketContract = new ethers.Contract(
       datahotpotMarketplaceAddress, 
       DatahotpotMarketplace.abi, 
       provider
    );
    const data = await marketContract.fetchNFTsByAddress(address);

    const items = await Promise.all(data.map(async (i: any) => {        
        const nftContract = new ethers.Contract(
            i.nftContract,
            DataNFT.abi,
            provider
        )

        const metadataUrl = await nftContract.getMetadata();
        // Fetch the metadataUrl
        const metadata = await axios.get(metadataUrl);

        console.log('metadata', metadata);
        const wei = ethers.utils.formatUnits(i.price.toString(), 'wei');
        console.log('price when fetching', i.price);
        
        const ownerAvatar = await axios.get(`/api/user/${i.owner.toLowerCase()}`);

        const item = {
            contract: i.nftContract,
            price: (Number(wei)).toString(),
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            name: metadata.data.name,
            context: metadata.data.context,
            contains: metadata.data.contains,
            sources: metadata.data.sources,
            tags: metadata.data.tags,
            itemId: i.itemId.toNumber(),
            thumbnailUrl: metadata.data.thumbnailUrl,
            fileName: metadata.data.fileName,
            fileSize: metadata.data.fileSize,
            ownerAvatar: ownerAvatar.data.avatar,
        }
        return item
    }))
    return items;
}
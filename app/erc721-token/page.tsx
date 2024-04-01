'use client';

import {
  Button,
  Image,
  Input,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { abi, address } from '../../contract/ERC721Token.json';
import styles from './page.module.scss';

const contract = {
  address: address as `0x${string}`,
  abi,
};

const Page = () => {
  const { isConnected } = useAccount();

  return (
    <div className={styles.airdropContainer}>
      <div className={styles.connectButton}>
        <ConnectButton />
      </div>
      {isConnected ? (
        <>
          <h1>NFT</h1>
          <Tabs>
            <TabList>
              <Tab>Mint</Tab>
              <Tab>我的 NFT</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <MintNFT />
              </TabPanel>
              <TabPanel>
                <MyNFT />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ) : (
        <p className={styles.info}>请先连接钱包</p>
      )}
    </div>
  );
};

const MintNFT = () => {
  const toast = useToast();
  const { address } = useAccount();
  const {
    data: hash,
    isPending,
    writeContract,
    isError,
    error,
  } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');

  const uploadImage = async (e: any) => {
    try {
      setUploadLoading(true);

      const filename = Date.now();

      // 上传图片
      const file = e.target.files[0];
      const formData = new FormData();
      const pinataMetadata = JSON.stringify({
        name: `${filename}.${file.type?.split('/')[1]}`,
      });
      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('file', file);
      formData.append('pinataMetadata', pinataMetadata);
      formData.append('pinataOptions', pinataOptions);
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data`,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_PRIVATE_KEY}`,
          },
        }
      );

      // 上传JSON文件
      const jsonData = JSON.stringify(
        {
          name,
          description,
          image: `ipfs://${res?.data?.IpfsHash}`,
        },
        undefined,
        4
      );
      const jsonBlob = new Blob([jsonData], {
        type: 'application/octet-stream',
      });
      const jsonFile = new File([jsonBlob], `${filename}.json`, {
        type: jsonBlob.type,
      });
      const jsonFormData = new FormData();
      const jsonPinataMetadata = JSON.stringify({
        name: `${filename}.json`,
      });
      const jsonPinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      jsonFormData.append('file', jsonFile);
      jsonFormData.append('pinataMetadata', jsonPinataMetadata);
      jsonFormData.append('pinataOptions', jsonPinataOptions);
      const jsonRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        jsonFormData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data`,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_PRIVATE_KEY}`,
          },
        }
      );

      setImage(`ipfs://${jsonRes.data.IpfsHash}`);
      toast({
        title: '上传成功',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: '上传失败',
        description: (error as any).toString(),
        status: 'error',
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const mint = () => {
    writeContract({
      ...contract,
      functionName: 'safeMint',
      args: [address, image],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: '空投成功',
        status: 'success',
      });
    }
    if (isError) {
      toast({
        title: '空投失败',
        description: (error as any).toString(),
        status: 'error',
      });
    }
  }, [isSuccess, isError]);

  return (
    <div className={styles.mintNFTcontainer}>
      <Input
        placeholder="输入NFT名称"
        value={name}
        onInput={(e) => setName((e.target as any).value)}
      />
      <Input
        placeholder="输入NFT描述"
        value={description}
        onInput={(e) => setDescription((e.target as any).value)}
      />
      <Input
        placeholder="请上传图片"
        type="file"
        accept="image/jpg, image/png"
        onChange={uploadImage}
      />
      <Button
        isLoading={uploadLoading || isPending || isLoading}
        onClick={mint}
      >
        铸造
      </Button>
    </div>
  );
};

const MyNFT = () => {
  const toast = useToast();

  const { data: totalSupply } = useReadContract({
    ...contract,
    functionName: 'totalSupply',
  });

  const contracts = useMemo(() => {
    if (totalSupply) {
      const contracts = [];
      for (let i = 0; i < (totalSupply as number); i++) {
        contracts.push({ ...contract, functionName: 'tokenURI', args: [i] });
      }
      return contracts;
    }
  }, [totalSupply]);

  const { data, error, isError, isLoading } = useReadContracts({
    contracts: contracts as any[],
  });
  const [nftList, setNFTList] = useState<any[]>([]);

  useEffect(() => {
    if (isError) {
      toast({
        title: '获取失败',
        description: (error as any).toString(),
        status: 'error',
      });
    }
  }, [isError]);

  const getNFTList = async () => {
    if (data) {
      const newNftList = [];
      for (let i = 0; i < data?.length; i++) {
        const nft: any = data?.[i];
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/${nft?.result.replace('://', '/')}`
        );
        newNftList.push(res.data);
      }
      setNFTList(newNftList);
    }
  };

  useEffect(() => {
    if (data) {
      getNFTList();
    }
  }, [data]);

  return (
    <>
      {isLoading && nftList?.length === 0 ? (
        <Spinner />
      ) : (
        <div className={styles.nftList}>
          {nftList?.map((nft, i) => (
            <div className={styles.nftItem} key={nft.name}>
              <Image
                src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/${nft?.image.replace('://', '/')}`}
                boxSize="280px"
              />
              <div className={styles.detail}>
                <p className={styles.number}>No: {i}</p>
                <h2>{nft.name}</h2>
                <p className={styles.description}>{nft.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;


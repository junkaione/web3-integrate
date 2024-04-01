'use client';

import { Button, Input, Textarea, useToast } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { abi, address } from '../../contract/ERC20Airdrop.json';
import { address as tokenAddress } from '../../contract/ERC20Token.json';
import styles from './page.module.scss';

const contract = {
  address: address as `0x${string}`,
  abi,
};

const Page = () => {
  const toast = useToast();

  const { isConnected } = useAccount();
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

  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const airdrop = () => {
    const addresses = address.split('\n');
    writeContract({
      ...contract,
      functionName: 'multiTransferToken',
      args: [tokenAddress, addresses, amount],
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
  }, [isError, isSuccess]);

  return (
    <div className={styles.airdropContainer}>
      <div className={styles.connectButton}>
        <ConnectButton />
      </div>
      {isConnected ? (
        <>
          <h1>代币空投</h1>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="请输入空投地址，多个换行输入"
          />
          <Input
            placeholder="请输入每个地址空投代币数量"
            value={amount}
            onInput={(e) => setAmount((e.target as any).value)}
          />
          <Button isLoading={isPending || isLoading} onClick={airdrop}>
            空投
          </Button>
        </>
      ) : (
        <p className={styles.info}>请先连接钱包</p>
      )}
    </div>
  );
};

export default Page;


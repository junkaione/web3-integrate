'use client';

import { Alert, Button, Input, Spinner, useToast } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { abi, address } from '../../contract/ERC20Token.json';
import styles from './page.module.scss';

const contract = {
  address: address as `0x${string}`,
  abi,
};

const Page = () => {
  const { isConnected } = useAccount();

  return (
    <div className={styles.tokenContainer}>
      <div className={styles.connectButton}>
        <ConnectButton />
      </div>
      {isConnected ? (
        <>
          <Detail />
          <BalanceOf />
          <Transfer />
        </>
      ) : (
        <p className={styles.info}>请先连接钱包</p>
      )}
    </div>
  );
};

const Detail = () => {
  const { data, error, isError, isLoading } = useReadContracts({
    contracts: [
      {
        ...contract,
        functionName: 'name',
      },
      {
        ...contract,
        functionName: 'symbol',
      },
      {
        ...contract,
        functionName: 'decimals',
      },
      {
        ...contract,
        functionName: 'totalSupply',
      },
    ],
  });

  const [name, symbol, decimals, totalSupply] = data || [];

  return (
    <div className={styles.detail}>
      <h1>代币信息</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.detailInfo}>
          <div>代币名称：{name?.result as string}</div>
          <div>代币代号：{symbol?.result as string}</div>
          <div>代币精度：{decimals?.result?.toString()}</div>
          <div>代币总量：{totalSupply?.result?.toString()}</div>
        </div>
      )}
      {isError ? (
        <Alert status="error">{`查询失败，失败原因：${error}`}</Alert>
      ) : null}
    </div>
  );
};

const BalanceOf = () => {
  const [address, setAddress] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const {
    data: balanceOf,
    error,
    isError,
    isLoading,
  } = useReadContract({
    ...contract,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: isFetching,
    },
  });

  useEffect(() => {
    setIsFetching(false);
  }, [balanceOf]);

  return (
    <div className={styles.balanceOf}>
      <h1>查询代币余额</h1>
      <div className={styles.container}>
        <Input
          placeholder="输入钱包地址查询代币余额"
          value={address}
          onInput={(e) => setAddress((e.target as any).value)}
        />
        <Button colorScheme="teal" onClick={() => setIsFetching(true)}>
          查询
        </Button>
      </div>
      {isLoading ? <Spinner /> : <div>{balanceOf?.toString()}</div>}
      {isError ? (
        <Alert status="error">{`查询失败，失败原因：${error}`}</Alert>
      ) : null}
    </div>
  );
};

const Transfer = () => {
  const toast = useToast();

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>();

  const transfer = () => {
    writeContract({
      ...contract,
      functionName: 'transfer',
      args: [address, amount],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: '转账成功',
        status: 'success',
      });
    }
  }, [isSuccess]);

  return (
    <div className={styles.transfer}>
      <h1>转账</h1>
      <Input
        placeholder="输入转账的钱包地址"
        value={address}
        onInput={(e) => setAddress((e.target as any).value)}
      />
      <Input
        placeholder="输入转账的代币数量"
        value={amount}
        onInput={(e) => setAmount((e.target as any).value)}
      />
      <Button
        colorScheme="teal"
        disabled={isPending || isLoading}
        onClick={transfer}
      >
        转账
      </Button>
      {isPending || isLoading ? <Spinner /> : null}
    </div>
  );
};

export default Page;

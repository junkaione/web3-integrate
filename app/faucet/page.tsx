'use client';

import { Alert, Button, Spinner, useToast } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { abi, address } from '../../contract/ERC20Faucet.json';
import styles from './page.module.scss';

const contract = {
  address: address as `0x${string}`,
  abi,
};

const Page = () => {
  const { isConnected } = useAccount();

  return (
    <div className={styles.faucetContainer}>
      <div className={styles.connectButton}>
        <ConnectButton />
      </div>
      {isConnected ? (
        <>
          <Detail />
          <Withdraw />
        </>
      ) : (
        <p className={styles.info}>请先连接钱包</p>
      )}
    </div>
  );
};

const Detail = () => {
  const { data, error, isError, isLoading } = useReadContract({
    ...contract,
    functionName: 'amountAllowed',
  });

  return (
    <div className={styles.detail}>
      <h1>代币信息</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.detailInfo}>
          <div>每个地址 24 小时只能领取一次</div>
          <div>每次可以领取 {data?.toString()} 个 ERC20 代币</div>
        </div>
      )}
      {isError ? (
        <Alert status="error">{`查询失败，失败原因：${error}`}</Alert>
      ) : null}
    </div>
  );
};

const Withdraw = () => {
  const toast = useToast();

  const {
    data: hash,
    isPending,
    writeContract,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading,
    isSuccess,
    error: waitError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = () => {
    writeContract({
      ...contract,
      functionName: 'requestToken',
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: '领取成功',
        status: 'success',
      });
    }
    if (writeError || waitError) {
      toast({
        title: '领取失败',
        description: ((writeError || waitError) as any).toString(),
        status: 'error',
      });
    }
  }, [isSuccess, writeError, waitError]);

  return (
    <Button isLoading={isPending || isLoading} onClick={withdraw}>
      领取
    </Button>
  );
};

export default Page;

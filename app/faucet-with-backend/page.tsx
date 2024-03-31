'use client';

import { Button, Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import styles from './page.module.scss';

const Page = () => {
  return (
    <div className={styles.faucetContainer}>
      <Detail />
      <Withdraw />
    </div>
  );
};

const Detail = () => {
  return (
    <div className={styles.detail}>
      <div className={styles.detailInfo}>
        <div>每个地址 24 小时只能领取一次</div>
        <div>每次可以领取 2000 个 ERC20 代币</div>
      </div>
    </div>
  );
};

const Withdraw = () => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const withdraw = async () => {
    setIsLoading(true);

    const res = await fetch('/api/faucet/withdraw', {
      method: 'POST',
      body: JSON.stringify({
        address: address,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      toast({
        title: data.message,
        status: 'success',
      });
    } else {
      toast({
        title: data.message,
        status: 'error',
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <Input
        placeholder="输入你的钱包地址"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button isLoading={isLoading} onClick={withdraw}>
        领取
      </Button>
    </>
  );
};

export default Page;

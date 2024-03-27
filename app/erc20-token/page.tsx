'use client';

import { Alert, Spinner } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContracts } from 'wagmi';
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
        </>
      ) : (
        <p>请先连接钱包</p>
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

export default Page;

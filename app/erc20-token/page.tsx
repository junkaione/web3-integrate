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
          <Approve />
          <Allowance />
          <TransferFrom />
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
        isLoading={isPending || isLoading}
        onClick={transfer}
      >
        转账
      </Button>
    </div>
  );
};

const Approve = () => {
  const toast = useToast();

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>();

  const approve = () => {
    writeContract({
      ...contract,
      functionName: 'approve',
      args: [address, amount],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: '授权成功',
        status: 'success',
      });
    }
  }, [isSuccess]);

  return (
    <div className={styles.approve}>
      <h1>授权</h1>
      <Input
        placeholder="输入授权的钱包地址"
        value={address}
        onInput={(e) => setAddress((e.target as any).value)}
      />
      <Input
        placeholder="输入授权的代币数量"
        value={amount}
        onInput={(e) => setAmount((e.target as any).value)}
      />
      <Button
        colorScheme="teal"
        isLoading={isPending || isLoading}
        onClick={approve}
      >
        授权
      </Button>
    </div>
  );
};

const Allowance = () => {
  const [owner, setOwner] = useState<string>('');
  const [spender, setSpender] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { data, error, isError, isLoading } = useReadContract({
    ...contract,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: isFetching,
    },
  });

  useEffect(() => {
    setIsFetching(false);
  }, [data]);

  return (
    <div className={styles.allowance}>
      <h1>查询代币授权余额</h1>
      <Input
        placeholder="输入授权人地址"
        value={owner}
        onInput={(e) => setOwner((e.target as any).value)}
      />
      <Input
        placeholder="输入被授权人地址"
        value={spender}
        onInput={(e) => setSpender((e.target as any).value)}
      />
      <Button colorScheme="teal" onClick={() => setIsFetching(true)}>
        查询
      </Button>
      {isLoading ? <Spinner /> : <div>{data?.toString()}</div>}
      {isError ? (
        <Alert status="error">{`查询失败，失败原因：${error}`}</Alert>
      ) : null}
    </div>
  );
};

const TransferFrom = () => {
  const toast = useToast();

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<number>();

  const transferFrom = () => {
    writeContract({
      ...contract,
      functionName: 'transferFrom',
      args: [from, to, amount],
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
    <div className={styles.transferFrom}>
      <h1>通过授权账户转账</h1>
      <Input
        placeholder="输入授权的钱包地址"
        value={from}
        onInput={(e) => setFrom((e.target as any).value)}
      />
      <Input
        placeholder="输入转账的钱包地址"
        value={to}
        onInput={(e) => setTo((e.target as any).value)}
      />
      <Input
        placeholder="输入转账的代币数量"
        value={amount}
        onInput={(e) => setAmount((e.target as any).value)}
      />
      <Button
        colorScheme="teal"
        isLoading={isPending || isLoading}
        onClick={transferFrom}
      >
        转账
      </Button>
    </div>
  );
};

export default Page;

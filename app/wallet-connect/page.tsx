'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

function Page() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const login = async () => {
    const token = localStorage.getItem('token');
    if (token) return;
    const signature = await signMessageAsync({ message: 'Hello, world!' });

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        address: address,
        signature,
      }),
    });
    const data = await res.json();
    localStorage.setItem('token', data.token);
  };

  useEffect(() => {
    if (isConnected) {
      login();
    }
  }, [isConnected]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
      }}
    >
      <ConnectButton />
    </div>
  );
}

export default Page;

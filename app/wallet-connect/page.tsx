import { ConnectButton } from '@rainbow-me/rainbowkit';

function Page() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20
      }}
    >
      <ConnectButton />
    </div>
  );
}

export default Page;

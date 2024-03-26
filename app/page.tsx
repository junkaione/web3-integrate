import styles from './index.module.scss';
import Link from 'next/link';

function Page() {
  return (
    <div className={styles.index}>
      <div className={styles.container}>
        <h1>Web3 Integrate</h1>
        <ul className={styles.main}>
          <li>
            <Link href="/wallet-connect">
              <h2>钱包连接</h2>
              <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
            </Link>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>使用 ethers.js、RainbowKit 连接 Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Page;

import Link from 'next/link';
import styles from './index.module.scss';

function Page() {
  return (
    <div className={styles.index}>
      <div className={styles.container}>
        <h1>Web3 Integrate</h1>
        <ul className={styles.main}>
          <li>
            <Link href="/wallet-connect">
              <h2>钱包连接</h2>
              <p>
                使用 ethers.js、RainbowKit 连接
                Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。
              </p>
            </Link>
          </li>
          <li>
            <Link href="/wallet-generator">
              <h2>钱包地址生成器</h2>
              <p>使用 ethers.js 批量生成随机的钱包地址，支持 Excel 导出。</p>
            </Link>
          </li>
          <li>
            <Link href="/wallet-number-generator">
              <h2>钱包靓号生成器</h2>
              <p>使用 ethers.js 实现的钱包靓号生成器。</p>
            </Link>
          </li>
          <li>
            <Link href="/erc20-token">
              <h2>ERC20 代币</h2>
              <p>
                基于 ERC20 协议实现的代币。实现了 ERC20
                的所有功能。包含了代币的发行、转账、查询余额、查询总量、授权、授权转账等功能。
              </p>
            </Link>
          </li>
          <li>
            <Link href="/faucet">
              <h2>ERC20 代币水龙头(智能合约版)</h2>
              <p>
                用于领取 ERC20
                代币的水龙头，实现了简单的代币领取功能。这个版本的实现需要用户连接钱包，并由用户支付
                gas 才可以领取。
              </p>
            </Link>
          </li>
          <li>
            <Link href="/faucet-with-backend">
              <h2>ERC20 代币水龙头(后端版)</h2>
              <p>
                用于领取 ERC20
                代币的水龙头，实现了简单的代币领取功能。这个版本的实现不需要用户连接钱包，由后端账户支付负责
                gas 费。
              </p>
            </Link>
          </li>
          <li>
            <Link href="/airdrop">
              <h2>ERC20 代币空投</h2>
              <p>使用空投合约实现ERC20代币的空投。</p>
            </Link>
          </li>
          <li>
            <h2>钱包连接</h2>
            <p>
              使用 ethers.js、RainbowKit 连接
              Metamask，实现了连接、断开、查询余额、刷新余额、转账等加密钱包的极简功能。
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Page;

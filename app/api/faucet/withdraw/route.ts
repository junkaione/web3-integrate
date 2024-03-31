import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import { abi, address } from '../../../../contract/ERC20Token.json';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. 获取参数 address
    const { address } = await req.json();

    // // 2. 检查地址是否合法
    const isAddress = ethers.isAddress(address);
    if (!isAddress) {
      return new Response(JSON.stringify({ message: 'Invalid address' }), {
        status: 400,
      });
    }

    // // 3. 初始化合约
    const { contract, wallet } = await initWalletAndContract();

    // 4. 检查水龙头余额
    const balance = await contract.balanceOf(wallet.address);
    if (Number(balance) < 2000) {
      return new Response(JSON.stringify({ message: 'Faucet insufficient' }), {
        status: 500,
      });
    }

    // 5. 查看领币记录
    const record = await prisma.faucetDrawRecord.findFirst({
      where: { address },
    });

    // 6. 判断领币记录及时间判断是否领币
    if (
      !record ||
      Date.now() - record.drawTime.getTime() > 24 * 60 * 60 * 1000
    ) {
      await contract.transfer(address, 2000);
      if (!record) {
        await prisma.faucetDrawRecord.create({
          data: {
            address,
            drawTime: new Date(),
          },
        });
      } else {
        await prisma.faucetDrawRecord.update({
          where: { id: record.id },
          data: {
            drawTime: new Date(),
          },
        });
      }
      return new Response(JSON.stringify({ message: '领币成功' }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: '24小时只能领币一次' }), {
        status: 400,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server error' }), {
      status: 500,
    });
  }
}

async function initWalletAndContract() {
  const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_URL);
  const wallet = new ethers.Wallet(
    process.env.WALLET_PRIVATE_KEY as string,
    provider
  );
  const contract = new ethers.Contract(address as string, abi, wallet);

  return { wallet, contract };
}

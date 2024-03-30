import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { verifyMessage } from 'viem';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. 接收参数 address, signature
    const { address, signature } = await req.json();
    if (!address || !signature) {
      return new Response(JSON.stringify({ message: 'Invalid params' }), {
        status: 400,
      });
    }

    // 2. 验证签名
    const result = await verifyMessage({
      address,
      message: 'Hello, world!',
      signature,
    });
    if (!result) {
      return new Response(JSON.stringify({ message: 'Invalid signature' }), {
        status: 400,
      });
    }

    // 3. 用户是否存在，不存在则创建用户，存在则返回用户信息
    const user = await prisma.user.findUnique({
      where: { account: address },
    });
    if (user) {
      return new Response(JSON.stringify({ token: sign(user, 'jk666') }), {
        status: 200,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        account: address,
      },
    });
    return new Response(JSON.stringify({ token: sign(newUser, 'jk666') }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server error' }), {
      status: 500,
    });
  }
}

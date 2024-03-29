'use client';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast,
} from '@chakra-ui/react';
import copy from 'copy-to-clipboard';
import { ethers } from 'ethers';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import styles from './page.module.scss';

const Page = () => {
  const [generateNum, setGenerateNum] = useState<number>(1);
  const [wallets, setWallets] = useState<ethers.HDNodeWallet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const toast = useToast();
  const [csvData, setCSVData] = useState<string[][]>([]);

  const generate = () => {
    setLoading(true);
    const _wallets: ethers.HDNodeWallet[] = [];
    for (let i = 0; i < generateNum; i++) {
      const _wallet = ethers.Wallet.createRandom();
      _wallets.push(_wallet);
    }
    setWallets(_wallets);
    setCSVData([
      ['地址', '公钥', '私钥', '助记词'],
      ..._wallets.map((wallet: any) => [
        wallet.address,
        wallet.publicKey,
        wallet.privateKey,
        wallet.mnemonic?.phrase,
      ]),
    ]);
    setLoading(false);
    openDialog();
  };

  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const handleCopy = (value?: string) => {
    if (!value) return;
    copy(value);
    toast({
      title: '复制成功!',
      status: 'success',
    });
  };

  return (
    <div className={styles.generatorContainer}>
      <h1>钱包地址生成器</h1>
      <div className={styles.generatorInput}>
        <span>生成数量</span>
        <NumberInput
          value={generateNum}
          onChange={(num) => setGenerateNum(Number(num))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </div>
      <Button colorScheme="teal" onClick={generate} isLoading={loading}>
        生成
      </Button>

      <Modal isOpen={dialogVisible} onClose={closeDialog} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>钱包列表</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion>
              {wallets.map((wallet) => (
                <AccordionItem key={wallet.address}>
                  <AccordionButton>
                    {wallet.address}
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <div className={styles.walletList}>
                      <div className={styles.walletItem}>
                        <p>地址</p>
                        <Input
                          value={wallet.address}
                          readOnly
                          onClick={() => handleCopy(String(wallet.address))}
                        />
                      </div>
                      <div className={styles.walletItem}>
                        <p>公钥</p>
                        <Input
                          value={wallet.publicKey}
                          readOnly
                          onClick={() => handleCopy(String(wallet.publicKey))}
                        />
                      </div>
                      <div className={styles.walletItem}>
                        <p>私钥</p>
                        <Input
                          value={wallet.privateKey}
                          readOnly
                          onClick={() => handleCopy(String(wallet.privateKey))}
                        />
                      </div>
                      <div className={styles.walletItem}>
                        <p>助记词</p>
                        <Input
                          value={wallet.mnemonic?.phrase}
                          readOnly
                          onClick={() =>
                            handleCopy(String(wallet.mnemonic?.phrase))
                          }
                        />
                      </div>
                    </div>
                  </AccordionPanel>
                </AccordionItem>
              ))}

              <CSVLink data={csvData}>
                <Button style={{ marginTop: 10 }}>批量导出</Button>
              </CSVLink>
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;

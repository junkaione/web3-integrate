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
  useToast,
} from '@chakra-ui/react';
import copy from 'copy-to-clipboard';
import { ethers } from 'ethers';
import { useState } from 'react';
import styles from './page.module.scss';

const Page = () => {
  const [startChar, setStartChar] = useState<string>('');
  const [includeChar, setIncludeChar] = useState<string>('');
  const [endChar, setEndChar] = useState<string>('');
  const [wallet, setWallet] = useState<ethers.HDNodeWallet>();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const toast = useToast();

  const generate = () => {
    setLoading(true);

    setTimeout(() => {
      const reg = new RegExp(`^0x${startChar}.*${includeChar}.*${endChar}$`);
      while (true) {
        const _wallet = ethers.Wallet.createRandom();
        if (reg.test(_wallet.address)) {
          setWallet(_wallet);
          openDialog();
          break;
        }
      }

      setLoading(false);
    }, 100);
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
    <div className={styles.walletNumberGenerator}>
      <h1>钱包靓号生成器</h1>
      <div className={styles.generatorInput}>
        <p>前缀</p>
        <Input
          value={startChar}
          onChange={(e) => setStartChar(e.target.value)}
        />
      </div>
      <div className={styles.generatorInput}>
        <p>中间包含</p>
        <Input
          value={includeChar}
          onChange={(e) => setIncludeChar(e.target.value)}
        />
      </div>
      <div className={styles.generatorInput}>
        <p>后缀</p>
        <Input value={endChar} onChange={(e) => setEndChar(e.target.value)} />
      </div>
      <Button colorScheme="teal" onClick={generate} isLoading={loading}>
        生成
      </Button>

      <Modal isOpen={dialogVisible} onClose={closeDialog} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>靓号钱包</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion>
              <AccordionItem key={wallet?.address}>
                <AccordionButton>
                  {wallet?.address}
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <div className={styles.walletList}>
                    <div className={styles.walletItem}>
                      <p>地址</p>
                      <Input
                        value={wallet?.address}
                        readOnly
                        onClick={() => handleCopy(String(wallet?.address))}
                      />
                    </div>
                    <div className={styles.walletItem}>
                      <p>公钥</p>
                      <Input
                        value={wallet?.publicKey}
                        readOnly
                        onClick={() => handleCopy(String(wallet?.publicKey))}
                      />
                    </div>
                    <div className={styles.walletItem}>
                      <p>私钥</p>
                      <Input
                        value={wallet?.privateKey}
                        readOnly
                        onClick={() => handleCopy(String(wallet?.privateKey))}
                      />
                    </div>
                    <div className={styles.walletItem}>
                      <p>助记词</p>
                      <Input
                        value={wallet?.mnemonic?.phrase}
                        readOnly
                        onClick={() =>
                          handleCopy(String(wallet?.mnemonic?.phrase))
                        }
                      />
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;

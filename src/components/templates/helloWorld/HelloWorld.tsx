import { Heading, Box, useColorModeValue, Button, Flex, Code } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  clusterApiUrl,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  PublicKey,
} from '@solana/web3.js';

const HelloWorld: FC = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { publicKey, sendTransaction } = useWallet();
  const [status, setStatus] = useState('');
  const [txLogs, setTxLogs] = useState<string[]>(['']);

  const programId = '3Adih9H8CheKTKfmmUYtr8cksbwoxvhWzsdupK6MfJAX';

  const connection = new Connection(clusterApiUrl('devnet'));

  const runHelloWorld = async () => {
    if (!publicKey) {
      throw new Error('Missing Wallet Public Key');
    }
    const transaction = new Transaction();
    setStatus('Processing Transaction');
    setTxLogs(['']);
    transaction.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: publicKey,
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: new PublicKey(programId),
      }),
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    try {
      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
        skipPreflight: true,
        signers: [],
        preflightCommitment: 'processed',
      });
      console.log({ blockhash, lastValidBlockHeight, signature, minContextSlot });

      const confirmtx = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log({ signature, confirmtx });
      const txdata = await connection.getParsedTransaction(signature);
      if (txdata?.meta?.logMessages) {
        setTxLogs(txdata?.meta?.logMessages);
      }
      console.log({ data: txdata?.meta?.logMessages });
      setStatus('');
    } catch (e) {
      console.log(e);
      setStatus('');
    }
  };

  useEffect(() => {
    console.log(publicKey?.toString());
  }, [publicKey]);

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Hello World
      </Heading>
      <Box>Test the Hello World Contract below</Box>
      <Flex
        border="2px"
        borderColor={hoverTrColor}
        borderRadius="xl"
        padding="24px 18px"
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'column'}
      >
        <Button mt={4} colorScheme="teal" isLoading={status ? true : false} onClick={runHelloWorld}>
          Run Program
        </Button>
        <Flex justifyContent={'right'} flexDirection={'column'} padding="24px 18px">
          <Code color={'green.300'}>{status}</Code>
          {txLogs.map((e, i) => {
            if (e.includes('Program log')) {
              return (
                <Code key={i} color={'green.300'}>
                  {e}
                </Code>
              );
            }
            return null;
          })}
        </Flex>
      </Flex>
    </>
  );
};

export default HelloWorld;

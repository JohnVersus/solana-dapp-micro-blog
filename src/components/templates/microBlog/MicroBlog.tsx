import { Heading, Box, useColorModeValue, Button, Flex, Code, Input } from '@chakra-ui/react';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  clusterApiUrl,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  PublicKey,
} from '@solana/web3.js';
import { ConfirmedSignatureInfo } from '@solana/web3.js';

import * as borsh from 'borsh';
import Blog from './Blog';

const MicroBlog: FC = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { publicKey, sendTransaction } = useWallet();
  const [status, setStatus] = useState('');
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>();
  const [blogInupt, setBlogInput] = useState('');

  // eslint-disable-next-line no-undef
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setBlogInput(e.target.value);
  };

  const programId = 'AYB7aikSKgHv26ZggnBW197sf2ufhvVWLJdWXJ6TTqQf';

  const connection = new Connection(clusterApiUrl('devnet'));

  const createBlog = async () => {
    if (!publicKey) {
      throw new Error('Missing Wallet Public Key');
    }

    // Account Creation --- Start
    const SEED = 'hello';
    class BlogCount {
      total_blogs = 0;
      constructor(fields: { total_blogs: number } | undefined = undefined) {
        if (fields) {
          this.total_blogs = fields.total_blogs;
        }
      }
    }
    const BlogSchema = new Map([
      [
        BlogCount,
        {
          kind: 'struct',
          fields: [['total_blogs', 'u32']],
        },
      ],
    ]);
    const DATA_SIZE = borsh.serialize(BlogSchema, new BlogCount()).length;
    console.log(DATA_SIZE);

    const accountPubkey = await PublicKey.createWithSeed(publicKey, SEED, new PublicKey(programId));

    const blogAccount = await connection.getAccountInfo(accountPubkey);
    console.log(accountPubkey.toBase58());

    if (blogAccount === null) {
      setStatus('Creating Account');
      console.log('Creating account', accountPubkey.toBase58(), 'to blogging');

      const lamports = await connection.getMinimumBalanceForRentExemption(DATA_SIZE);

      console.log({ lamports, DATA_SIZE, BlogSchema, blogAccount, accountPubkey });

      const AccountCreation = new Transaction();
      AccountCreation.add(
        SystemProgram.createAccountWithSeed({
          fromPubkey: publicKey,
          basePubkey: publicKey,
          seed: SEED,
          newAccountPubkey: accountPubkey,
          lamports,
          space: DATA_SIZE,
          programId: new PublicKey(programId),
        }),
      );
      console.log('created AccountWithSeed', AccountCreation);
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(AccountCreation, connection, {
        minContextSlot,
        skipPreflight: true,
        signers: [],
        preflightCommitment: 'processed',
      });
      console.log({ blockhash, lastValidBlockHeight, signature, minContextSlot });
      const confirmtx = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log({ signature, confirmtx });
      setStatus('Account Created');
    }
    // Account Creation --- END

    const transaction = new Transaction();
    setStatus('Processing Transaction');
    transaction.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: accountPubkey,
            isSigner: false,
            isWritable: true,
          },
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
        data: Buffer.from(blogInupt),
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
      await connection.getParsedTransaction(signature);
      getAllTransactions();
      setStatus('');
    } catch (e) {
      console.log(e);
      setStatus('');
    }
  };

  const getAllTransactions = async () => {
    const data = await connection.getSignaturesForAddress(new PublicKey(programId));
    console.log(data);
    setTransactions(data);
  };

  useEffect(() => {
    if (programId) {
      getAllTransactions();
    }
  }, [programId]);

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Micro Blogger
      </Heading>
      <Box>Create Micro Blogs on the Solana Blockchain</Box>
      <Flex
        border="2px"
        borderColor={hoverTrColor}
        borderRadius="xl"
        padding="24px 18px"
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'column'}
      >
        <Flex direction={'row'} width={'auto'} gap={'8px'} margin={'8px'}>
          <Input placeholder="Enter Blog Post" size={'md'} width={'400px'} onChange={handleInput} />
          <Button colorScheme="teal" isLoading={status ? true : false} onClick={createBlog}>
            Post Blog
          </Button>
        </Flex>
        <Code color={'green.300'}>{status}</Code>
        <Flex
          justifyContent={'left'}
          flexDirection={'row'}
          flexWrap={'wrap'}
          padding="24px 18px"
          maxHeight={'500'}
          gap={'8px'}
          overflowX={'auto'}
        >
          {transactions &&
            transactions.map((e, i) => {
              if (e.signature) {
                return <Blog key={i} signature={e.signature} connection={connection} />;
              }
              return null;
            })}
        </Flex>
      </Flex>
    </>
  );
};

export default MicroBlog;

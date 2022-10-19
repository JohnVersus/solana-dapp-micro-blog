import { Box, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FC } from 'react';
import { BlogSignature } from './types';
import { getEllipsisTxt } from '../../../utils/format';
import { useWallet } from '@solana/wallet-adapter-react';

const Blog: FC<BlogSignature> = ({ signature, connection }) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const [txData, setTxData] = useState<string[]>(['']);
  const [author, setAuthor] = useState<string>('');
  const [blogNo, setBlogNo] = useState<string>('');
  const [blog, setBlog] = useState<string>('');

  const { publicKey } = useWallet();

  const getNFTMetadata = async () => {
    const txdata = await connection.getParsedTransaction(signature);
    if (txdata?.meta?.logMessages) {
      setTxData(txdata?.meta?.logMessages);
    }
  };

  useEffect(() => {
    if (signature) {
      getNFTMetadata();
    }
  }, [signature]);

  useEffect(() => {
    if (txData) {
      for (const e of txData) {
        const log = e.replace('Program log: ', '');
        if (log.includes('Author:')) {
          setAuthor(log);
        }
        if (e.includes('Blog No:')) {
          setBlogNo(log);
        }
        if (e.includes('Blog:')) {
          setBlog(log);
        }
      }
    }
  }, [txData]);
  if (blog) {
    return (
      <>
        <Box
          maxWidth="300px"
          bgColor={bgColor}
          padding={3}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Box maxHeight="260px" minWidth={'300px'} borderRadius="xl"></Box>
          <Box mt="1" fontWeight="light" as="h4" noOfLines={1} marginTop={2} height={'100px'}>
            {blog ? blog.replace('Blog: ', '') : <>n/a</>}
          </Box>
          <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
            <Box>
              <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
                Author:
              </Box>
              <Box
                as="h4"
                noOfLines={1}
                fontSize="sm"
                color={publicKey?.toBase58() === author.replace('Author: ', '') ? 'yellow.500' : ''}
              >
                {author ? getEllipsisTxt(author.replace('Author: ', '')) : <>n/a</>}
              </Box>
            </Box>
            <Box>
              <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
                Blog No:
              </Box>
              <Box as="h4" noOfLines={1} fontSize="sm">
                {blogNo ? blogNo.replace('Blog No: ', '') : <>n/a</>}
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
      </>
    );
  }
  return null;
};

export default Blog;

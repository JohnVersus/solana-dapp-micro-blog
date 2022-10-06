import { Heading, Box, useColorModeValue } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { getEllipsisTxt } from 'utils/format';

const Transactions: FC = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Hello World
      </Heading>
      <Box>Test the Hello World Contract below</Box>

      <Box border="2px" borderColor={hoverTrColor} borderRadius="xl" padding="24px 18px"></Box>
    </>
  );
};

export default Transactions;

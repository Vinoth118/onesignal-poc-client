import { Button, Flex, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <Flex w = '100%' h = '100vh'>
      <Flex m = 'auto' gap = '50px'>
        <LinkButton label = 'Admin' href='/admin' />
        <LinkButton label = 'Client' href='/client' />
      </Flex>
    </Flex>
  )
}

export default Home;

const LinkButton = ({ href, label }: { href: string, label: string }) => {
  return (
    <NextLink href = {href} passHref>
      <Link _hover={{}}>
        <Flex w = '150px' p = '15px' bg = 'black' _hover = {{ bg: 'blackAlpha.700' }} color = 'white' borderRadius={'8px'}>
          <Text m = 'auto'>{label}</Text>
        </Flex>
      </Link>
    </NextLink>
  );
}

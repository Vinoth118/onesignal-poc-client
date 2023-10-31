import type { NextPage } from 'next';
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, Textarea, useToast } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react';
import UserForm, { User } from '../components/admin/register_user';
import useLocalStorage from '../components/hooks/use_localstorage';
import axios from 'axios';

const Client: NextPage = () => {
    const [loggedInUser, setLoggedInUser] = useLocalStorage('loggedInUser');
    const [formType, setFormType] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const toast = useToast();

    const onLoginOrRegister = (data: User) => {
        if(formType == 'LOGIN') {
            onLogin(data);
        } else {
            onRegister(data);
        }
    }

    const onLogin = async (data: User) => {
        try {
            const res = await axios.post('http://localhost:3000/login', { email: data.email });
            if(res.data && res.data.success) {
                setLoggedInUser(res.data.data);
                return true;
            } else {
                toast({
                    title: 'Email registered yet!',
                    position: 'top-right',
                    isClosable: true,
                    status: 'error'
                })
                return false;
            }
        } catch(e) {
            toast({
                title: 'Invalid email!',
                position: 'top-right',
                isClosable: true,
                status: 'error'
            })
            return false;
        } 
    }

    const onRegister = async (data: User) => {
        try {
            const res = await axios.post('http://localhost:3000/register', { email: data.email, name: data.name });
            if(res.data && res.data.success) {
                setLoggedInUser(res.data.data);
                return true;
            } else {
                toast({
                    title: 'Email already registered!',
                    position: 'top-right',
                    isClosable: true,
                    status: 'error'
                })
                return false;
            }
        } catch(e) {
            toast({
                title: 'Something went wrong!',
                position: 'top-right',
                isClosable: true,
                status: 'error'
            })
            return false;
        } 
    }

    const onLogout = () => {
        setLoggedInUser(null);
    }
    
    return (
        <Flex w = '100%' h = '100vh'>
            {
                loggedInUser == null ?
                <Flex minW = {['350px', '400px', '400px', '400px', '400px']} m = 'auto' direction={'column'}>
                    <UserForm onSubmit = {onLoginOrRegister} formFor = {formType} formFrom = 'CLIENT' />
                    <Flex my = '20px' w = '100%' position={'relative'} alignItems = 'center' h = '50px'>
                        <Flex top = {'50%'} left = {'50%'} transform = 'translate(-50%, -50%)' position={'absolute'} w = '150px' h = '2px' bg = 'black' />
                        <Flex top = {'50%'} left = {'50%'} transform = 'translate(-50%, -50%)' w = 'fit-content' h = 'fit-content' position={'absolute'} p = '5px' borderRadius={'40%'} bg = 'white'>Or</Flex>
                    </Flex>
                    <Button onClick={() => setFormType(prev => prev == 'REGISTER' ? 'LOGIN' : 'REGISTER')} flexShrink = {0} w = '100%' bg = 'black' color = 'white' _hover={{ bg: 'blackAlpha.700' }}>{formType == 'REGISTER' ? 'Login' : 'Sign Up'}</Button>
                </Flex> :
                <Flex direction={'column'} minW = {['350px', '400px', '400px', '400px', '400px']} m = 'auto' gap = '20px' alignItems={'center'}>
                    <Heading w = 'fit-content'>Hi, {loggedInUser.name}</Heading>
                    <Button onClick={onLogout} w = '100%' bg = 'black' color = 'white' _hover={{ bg: 'blackAlpha.700' }}>Logout</Button>
                </Flex>
            }
        </Flex>
    )
}
  
export default Client;
import type { NextPage } from 'next';
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, Textarea, useToast } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react';
import UserForm, { NewUser, User } from '../components/admin/register_user';
import useLocalStorage from '../components/hooks/use_localstorage';
import axios from 'axios';
//import { IOneSignalOneSignal, OneSignalWindow } from '../components/onsignal';
import OneSignal from 'react-onesignal';

//let _window: OneSignalWindow | null;

const Client: NextPage = () => {
    const [loggedInUser, setLoggedInUser] = useLocalStorage('loggedInUser');
    const [formType, setFormType] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const toast = useToast();

    // const initializeOneSignal = () => {
    //     _window = window as OneSignalWindow;
    //     _window.OneSignalDeferred = _window.OneSignalDeferred || [];
    // }

    const initializeOneSignal = async (appId: string) => {
        return new Promise<void>((resolve, reject) => {
            OneSignal.init({ appId: appId, allowLocalhostAsSecureOrigin: true }).then(e => {
                console.log('onsignal loaded');
                resolve();
            }).catch(e => {
                console.log('error while loading onesignal on logout', e)
                resolve();
            });
        })     
    }

    const onLoginOrRegister = (data: NewUser) => {
        if(formType == 'LOGIN') {
            onLogin(data);
        } else {
            onRegister(data);
        }
    }

    const onLogin = async (data: NewUser) => {
        setSubmitLoading(true);
        try {
            const res = await axios.post('/login', { email: data.email });
            if(res.data && res.data.success) {
                onLoginSuccess(res.data.data);
                setSubmitLoading(false);
                return true;
            } else {
                toast({
                    title: 'Email not registered yet!',
                    position: 'top-right',
                    isClosable: true,
                    status: 'error'
                })
                setSubmitLoading(false);
                return false;
            }
        } catch(e) {
            toast({
                title: 'Invalid email!',
                position: 'top-right',
                isClosable: true,
                status: 'error'
            })
            setSubmitLoading(false);
            return false;
        } 
    }

    const onRegister = async (data: NewUser) => {
        setSubmitLoading(true);
        try {
            const res = await axios.post('/register', { email: data.email, name: data.name });
            if(res.data && res.data.success) {
                onLoginSuccess(res.data.data);
                setSubmitLoading(false);
                return true;
            } else {
                toast({
                    title: 'Email already registered!',
                    position: 'top-right',
                    isClosable: true,
                    status: 'error'
                })
                setSubmitLoading(false);
                return false;
            }
        } catch(e) {
            toast({
                title: 'Something went wrong!',
                position: 'top-right',
                isClosable: true,
                status: 'error'
            })
            setSubmitLoading(false);
            return false;
        } 
    }

    const onLoginSuccess = async (resData: { user: User, oneSignalAppId: string }) => {
        console.log('login success: ', resData);
        setLoggedInUser(resData);
        // initializeOneSignal();
        // const OneSignalDeferred = _window?.OneSignalDeferred as any;
        // OneSignalDeferred.push(async function(OneSignal: IOneSignalOneSignal) {
        //     await OneSignal.init({ appId: resData.oneSignalAppId, allowLocalhostAsSecureOrigin: true });
        //     OneSignal.Slidedown.promptPush();
        //     OneSignal.login(resData.user.id);
        // });
        await initializeOneSignal(resData.oneSignalAppId);
        OneSignal.Slidedown.promptPush();
        OneSignal.login(resData.user.id);   
    }

    const onLogout = async () => {
        setSubmitLoading(true);
        await initializeOneSignal(loggedInUser!.oneSignalAppId);
        console.log(OneSignal.logout())
        setSubmitLoading(false);
        // initializeOneSignal();
        // _window?.OneSignal?.logout();
        setLoggedInUser(null);
    }
    
    return (
        <Flex w = '100%' h = '100vh'>
            {
                loggedInUser == null ?
                <Flex minW = {['350px', '400px', '400px', '400px', '400px']} m = 'auto' direction={'column'}>
                    <UserForm onSubmit = {onLoginOrRegister} isLoading = {isSubmitLoading} formFor = {formType} formFrom = 'CLIENT' />
                    <Flex my = '20px' w = '100%' position={'relative'} alignItems = 'center' h = '50px'>
                        <Flex top = {'50%'} left = {'50%'} transform = 'translate(-50%, -50%)' position={'absolute'} w = '150px' h = '2px' bg = 'black' />
                        <Flex top = {'50%'} left = {'50%'} transform = 'translate(-50%, -50%)' w = 'fit-content' h = 'fit-content' position={'absolute'} p = '5px' borderRadius={'40%'} bg = 'white'>Or</Flex>
                    </Flex>
                    <Button onClick={() => setFormType(prev => prev == 'REGISTER' ? 'LOGIN' : 'REGISTER')} flexShrink = {0} w = '100%' bg = 'black' color = 'white' _hover={{ bg: 'blackAlpha.700' }}>{formType == 'REGISTER' ? 'Have account? Login' : "Doesn't have account? Sign Up"}</Button>
                </Flex> :
                <Flex direction={'column'} minW = {['350px', '400px', '400px', '400px', '400px']} m = 'auto' gap = '20px' alignItems={'center'}>
                    <Heading w = 'fit-content'>Hi, {loggedInUser.user.name}</Heading>
                    <Button onClick={onLogout} isLoading = {isSubmitLoading} w = '100%' bg = 'black' color = 'white' _hover={{ bg: 'blackAlpha.700' }}>Logout</Button>
                </Flex>
            }
        </Flex>
    )
}
  
export default Client;
import type { NextPage } from 'next';
import { 
    Flex, Button, Text, useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useDisclosure,
    Spinner
} from '@chakra-ui/react'
import UserForm, { NewUser, User } from '../components/admin/register_user';
import PushNotification, { NotificationPayload } from '../components/admin/push_notification';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Admin: NextPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [getUsersLoading, setGetUsersLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        setGetUsersLoading(true);
        try {
            const res = await axios.get('/users');
            if(res.data && res.data.success) {
                setUsers(res.data.data);
            }
        } catch(e) {}
        setGetUsersLoading(false);
    }

    const onRegister = async (data: NewUser) => {
        setRegisterLoading(true);
        console.log(data);
        try {
            const res = await axios.post('/register', { ...data, registerFrom: 'ADMIN' });
            if(res.data && res.data.success) {
                setUsers(prev => [...prev, res.data.data.user]);
                toast({
                    title: 'User added successfully!',
                    position: 'top-right',
                    isClosable: true,
                    status: 'success'
                })
                setRegisterLoading(false);
                return true;
            } else {
                toast({
                    title: 'Email already registered with the organisation!',
                    position: 'top-right',
                    isClosable: true,
                    status: 'error'
                })
                setRegisterLoading(false);
                return false;
            }
        } catch(e) {
            toast({
                title: 'Something went wrong!',
                position: 'top-right',
                isClosable: true,
                status: 'error'
            })
            setRegisterLoading(false);
            return false;
        }
    }

    const onPushNotification = async (data: NotificationPayload) => {
        setSubmitLoading(true);
        try {
            const res = await axios.post('/notify', data);
            if(res.data && res.data.success) {
                toast({
                    title: 'Notification pushed successfully!',
                    position: 'top-right',
                    isClosable: true,
                    status: 'success'
                })
                setSubmitLoading(false);
                return true;
            } else {
                toast({
                    title: 'Push Notification failed!',
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

    return (
        <Flex w = '100%' minH = '100vh' direction={['column', 'column', 'row', 'row', 'row']} gap = '20px'>
            <AlertDialog isOpen = {isOpen} leastDestructiveRef = {null as any} onClose = {onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Registered Users
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            {
                                getUsersLoading ? 
                                <Flex w = '100%' py = '50px' justifyContent={'center'}>
                                    <Spinner colorScheme={'blackAlpha'} size = 'xl' thickness='4px' />
                                </Flex> :
                                users.length < 1 ? 
                                <Flex w = '100%' py = '50px' justifyContent={'center'}>
                                    <Text>No user registered yet!</Text>
                                </Flex>:
                                users.map((user, index) => {
                                    return <Flex key = {user.email} w = '100%' direction={'column'} p = '10px' border = '1px' borderRadius={'8px'} mb = '15px'>
                                        <Text fontSize={'lg'}>{user.name}</Text>
                                        <Text>{user.email}</Text>
                                        <Text>{user.org}.trendytreasures.nl</Text>
                                    </Flex>
                                })
                            }
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Flex w = '100%' h = '100%' p = '15px' direction={'column'} gap = '30px'>
                <UserForm onSubmit = {onRegister} isLoading = {registerLoading} formFor = 'REGISTER' />
                <Flex w = '100%' position={'relative'} alignItems = 'center' h = '50px'>
                    <Flex top = {'50%'} left = {'50%'} transform = 'translate(-50%, -50%)' position={'absolute'} w = '150px' h = '2px' bg = 'black' />
                    <Flex top = {'50%'} left = {'50%'} transform = 'translate(-50%, -50%)' w = 'fit-content' h = 'fit-content' position={'absolute'} p = '5px' borderRadius={'40%'} bg = 'white'>Or</Flex>
                </Flex>
                <Button onClick={() => {getUsers(); onOpen();}} flexShrink = {0} w = '100%' bg = 'black' color = 'white' _hover={{ bg: 'blackAlpha.700' }}>Show Users</Button>
            </Flex>
            <Flex flexShrink={0} w = {['100%', '100%', '4px', '4px', '4px']} h = {['4px', '4px', 'inherit', 'inherit', 'inherit']} bg = 'black' />
            <Flex w = '100%' h = '100%' p = '15px'>
                <PushNotification onClickRefreshUsers={() => getUsers()} userFetchLoading = {getUsersLoading} isLoading = {submitLoading} onSubmit={onPushNotification} userList = {users} />
            </Flex>
        </Flex>
    )
}
  
export default Admin;
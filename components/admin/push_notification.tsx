import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, Textarea, Collapse, useRadio, UseRadioProps, useRadioGroup, Select } from '@chakra-ui/react'
import React, { ChangeEvent, useState, PropsWithChildren, ReactNode } from 'react';
import { User } from './register_user';

interface PushNotificationProps {
    userList?: User[]
}

const PushNotification = ({ userList }: PushNotificationProps) => {
    type StateType = { msg: string, to: 'all' | 'org' | 'user', org: 'vinoth' | 'vijay' | 'johny' }
    const [formData, setFormData] = useState<StateType>({ msg: '', to: 'all', org: 'vinoth' });

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'notify_to',
        onChange: (value) => {
            let to: StateType['to'] = 'all';
            switch(value) {
                case 'org': to = 'org'; break;
                case 'user': to = 'user'; break;
            }
            setFormData(prev => ({ ...prev, to }));
        },
    });
    const radioGroup = getRootProps();

    const { getRootProps: getRootPropsForOrg, getRadioProps: getRadioPropsForOrg } = useRadioGroup({
        name: 'org',
        onChange: (value) => {
            let org: StateType['org'] = 'vinoth';
            switch(value) {
                case 'vijay': org = 'vijay'; break;
                case 'johny': org = 'johny'; break;
            }
            setFormData(prev => ({ ...prev, org }));
        },
    });
    const orgRadioGroup = getRootPropsForOrg();

    return (
        <Flex w = '100%' direction={'column'} alignItems={'center'} gap = '20px'>
            <Heading>Push Notification</Heading>
            <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea value = {formData.msg} />
                <FormErrorMessage ml ='10px'>Please type message!</FormErrorMessage>
            </FormControl>

            <FormLabel alignSelf={'flex-start'} mb = '-10px'>Notify to</FormLabel>
            
            <Flex w = '100%' gap = '20px' direction = {'column'} {...radioGroup} p = '20px' borderRadius = {'10px'} border = '1px'>

                <Flex w = '100%' gap = '10px'>
                    <RadioCard2 {...getRadioProps({ value: 'all' })} isChecked = {formData.to == 'all'} >
                        <Text cursor = 'pointer'>All users</Text>
                    </RadioCard2>
                    <RadioCard2 {...getRadioProps({ value: 'org' })} isChecked = {formData.to == 'org'} >
                        <Text cursor = 'pointer'>Organisation</Text>
                    </RadioCard2>
                    <RadioCard2 {...getRadioProps({ value: 'user' })} isChecked = {formData.to == 'user'} >
                        <Text cursor = 'pointer'>Specific user</Text>
                    </RadioCard2>
                </Flex>

                <Collapse unmountOnExit animateOpacity in = {formData.to != 'all'}>
                    {
                        formData.to == 'org' ?
                        <Flex direction = 'column' gap = '10px' {...orgRadioGroup}>
                            <RadioCard {...getRadioPropsForOrg({ value: 'vinoth' })} isChecked = {formData.org == 'vinoth'} >
                                <Text cursor = 'pointer'>vinoth.trendytreasures.nl</Text>
                            </RadioCard>
                            <RadioCard {...getRadioPropsForOrg({ value: 'vijay' })} isChecked = {formData.org == 'vijay'} >
                                <Text cursor = 'pointer'>vijay.trendytreasures.nl</Text>
                            </RadioCard>
                            <RadioCard {...getRadioPropsForOrg({ value: 'johny' })} isChecked = {formData.org == 'johny'} >
                                <Text cursor = 'pointer'>johny.trendytreasures.nl</Text>
                            </RadioCard>
                        </Flex> :
                        <Flex direction = 'column'>
                            {
                                userList != null ?
                                <Select>
                                    <option value = ''>Select option</option>
                                    {
                                        userList.map(user => {
                                            return <option key = {user.email} value = {user.email}>{user.name}</option>
                                        })
                                    }
                                </Select> :
                                <Input placeholder = 'Enter user email ID' />
                            }                   
                        </Flex>
                    }
                </Collapse>

            </Flex>

            <Button mt = '20px' w = '100%' flexShrink = {0} bg = 'black' color = 'white' _hover={{ bg: 'blackAlpha.700' }}>Send Notification</Button>
        </Flex>
    );
}

export default PushNotification;

type RadioCardProps = UseRadioProps & {
    children: ReactNode;
}

const RadioCard = (props: RadioCardProps) => {
    const { getInputProps, getRadioProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getRadioProps()
  
    return (
      <Flex as='label' cursor='pointer'>
        <input {...input} />
        <Flex
            {...checkbox}
            gridGap = '10px'
            alignItems = 'center'
            opacity = {props.isDisabled ? '0.6' : 'auto'}
        >
            <Flex flexShrink = {0} w = '20px' h = '20px' borderRadius = '50%' border = '2px' borderColor = {props.isDisabled ? 'gray.300' : 'black'} alignItems = 'center' justifyContent = 'center' bg = {props.isDisabled ? 'gray.300' : 'white'}>
                {props.isChecked && <Flex w = '10px' h = '10px' bg = {props.isDisabled ? 'gray.300' : 'black'} borderRadius = '50%'></Flex>}
            </Flex>
            {props.children}
        </Flex>
      </Flex>
    )
}



type RadioCardProps2 = UseRadioProps & {
    children: ReactNode;
}

const RadioCard2 = (props: RadioCardProps) => {
    const { getInputProps, getRadioProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getRadioProps()
  
    return (
      <Flex 
        w = '100%' minH = '40px'
        p = '10px'
        as='label' 
        cursor='pointer'
        opacity = {props.isDisabled ? '0.6' : 'auto'}
        bg = {props.isChecked ? 'black' : 'white'}
        color = {!props.isChecked ? 'black' : 'white'} 
        border = {!props.isChecked ? '1px' : '0px'} 
        borderRadius = {'5px'}
    >
        <input {...input} />
        <Flex {...checkbox} m = 'auto' textAlign={'center'}>
            {props.children}
        </Flex>
      </Flex>
    )
}
import { useState, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import { User } from '../admin/register_user';

const useLocalStorage = (key: string): [null | User, Dispatch<SetStateAction<User | null>>] => {
    const isMounted = useRef(false)
    const [value, setValue] = useState<null | User>(null)
  
    useEffect(() => {
      try {
        const item = window.localStorage.getItem(key)
        if(item) setValue(JSON.parse(item))
      } catch (e) {
        console.log(e)
      }
      return () => {
        isMounted.current = false
      }
    }, [key])
  
    useEffect(() => {
      if (isMounted.current) {
        window.localStorage.setItem(key, JSON.stringify(value))
      } else {
        isMounted.current = true
      }
    }, [key, value])
  
    return [value, setValue]
  }

export default useLocalStorage;
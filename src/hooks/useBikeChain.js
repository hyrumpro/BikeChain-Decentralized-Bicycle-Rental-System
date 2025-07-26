/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { getContractInstance } from '../services/contractService';
import { useWeb3 } from '../contexts/Web3Context';

export function useBikeChainRead(functionName, args = []) {
  const { provider, signer } = useWeb3();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const fetchData = useCallback(async () => {
    if (!provider && !signer) return;
    setIsLoading(true);
    setError(undefined);
    try {
      const contract = getContractInstance(signer || provider);
      const result = await contract[functionName](...(args || []));
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [provider, signer, functionName, JSON.stringify(args)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useBikeChainWrite(functionName) {
  const { signer } = useWeb3();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState();

  const execute = async (...args) => {
    if (!signer) {
      toast({ title: 'Wallet not connected', status: 'error' });
      throw new Error('Wallet not connected');
    }
    setIsLoading(true);
    setIsSuccess(false);
    setError(undefined);
    try {
      const contract = getContractInstance(signer);
      const tx = await contract[functionName](...args);
      const receipt = await tx.wait();
      setData(receipt);
      setIsSuccess(true);
      toast({ title: 'Transaction Successful', status: 'success' });
    } catch (err) {
      setError(err);
      toast({ title: 'Transaction Failed', description: err.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, isSuccess, error, data };
}

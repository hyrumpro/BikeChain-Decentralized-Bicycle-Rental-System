import { Contract } from 'ethers';
import config from '../config.json';

export function getContractInstance(signerOrProvider) {
  return new Contract(config.contractAddress, config.abi, signerOrProvider);
}

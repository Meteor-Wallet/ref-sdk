import { TokenMetadata } from '../types';
import { DCL_POOL_FEE_LIST } from '../constant';
import { refDCLSwapViewFunction, } from '../ref';
import { NoFeeToPool } from '../error';

interface PoolInfo {
  pool_id?: string;
  token_x?: string;
  token_y?: string;
  fee: number;
  point_delta?: number;
  current_point?: number;
  state?: string;
  liquidity?: string;
  liquidity_x?: string;
  max_liquidity_per_point?: string;
  percent?: string;
  total_x?: string;
  total_y?: string;
  tvl?: number;
  token_x_metadata?: TokenMetadata;
  token_y_metadata?: TokenMetadata;
}

export const getDCLPoolId = (tokenA: string, tokenB: string, fee: number) => {
  if (DCL_POOL_FEE_LIST.indexOf(fee) === -1) throw NoFeeToPool(fee);

  const tokenSeq = [tokenA, tokenB].sort().join('|');

  return `${tokenSeq}|${fee}`;
};
export const listDCLPools = () => {
  return refDCLSwapViewFunction({
    methodName: 'list_pools',
  });
};

export const getDCLPool = async (pool_id: string) => {
  const [token_x, token_y, fee] = pool_id.split('|');

  const token_seq = [token_x, token_y].sort().join('|');

  const new_pool_id = `${token_seq}|${fee}`;

  return refDCLSwapViewFunction({
    methodName: 'get_pool',
    args: {
      pool_id: new_pool_id,
    },
  }) as Promise<PoolInfo>;
};

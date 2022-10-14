import React, { useState, useEffect, useContext, useRef } from 'react';
import { TokenMetadata } from '../types';
import {
  ThemeContext,
  useTokenPriceList,
  TokenPriceContext,
  useTokenBalnces,
} from './state';

import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';

import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';

import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';

import { FaSearch } from '@react-icons/all-files/fa/FaSearch';

import { IoCloseCircle } from '@react-icons/all-files/io5/IoCloseCircle';

import { TiArrowSortedUp } from '@react-icons/all-files/ti/TiArrowSortedUp';

import { TiArrowSortedDown } from '@react-icons/all-files/ti/TiArrowSortedDown';

import { HiOutlineExternalLink } from '@react-icons/all-files/hi/HiOutlineExternalLink';

import { AiFillPushpin } from '@react-icons/all-files/ai/AiFillPushpin';

import { AiOutlinePushpin } from '@react-icons/all-files/ai/AiOutlinePushpin';

import { RiExchangeFill } from '@react-icons/all-files/ri/RiExchangeFill';

import './style.css';
import {
  getAccountName,
  symbolsArr,
  multiply,
  percentOfBigNumber,
  ONLY_ZEROS,
  toRealSymbol,
  toPrecision,
  toInternationalCurrencySystemLongString,
  calculateFeeCharge,
  calculateFeePercent,
} from '../utils';
import {
  DEFAULT_START_TOKEN_LIST,
  REF_WIDGET_STAR_TOKEN_LIST_KEY,
} from './constant';
import Big from 'big.js';
import { config, FEE_DIVISOR, TokenLinks } from '../constant';

interface TokenAmountProps {
  balance?: string;
  reloading?: JSX.Element;
  token?: TokenMetadata;
  onSelectToken: () => void;
  amount: string;
  onChangeAmount?: (amount: string) => void;
  price?: string;
  onForceUpdate?: () => void;
}

export const DetailView = ({
  tokenIn,
  tokenOut,
  rate,
  fee,
  minReceived,
  amountIn,
}: {
  tokenIn: TokenMetadata | undefined;
  tokenOut: TokenMetadata | undefined;
  rate: string;
  fee: number;
  minReceived: string;
  amountIn: string;
}) => {
  const theme = useContext(ThemeContext);

  const [showDetail, setShowDetail] = useState(false);
  const [isRateReverse, setIsRateReverse] = useState(false);

  if (!tokenIn || !tokenOut) return null;

  const displayRate = `1 ${toRealSymbol(tokenIn.symbol)} ≈ ${
    Number(rate) < 0.01 ? '< 0.01' : toPrecision(rate, 2)
  } ${toRealSymbol(tokenOut.symbol)}`;

  const revertRate = new Big(1).div(ONLY_ZEROS.test(rate) ? '1' : rate || '1');

  const revertDisplayRate = `1 ${toRealSymbol(tokenOut.symbol)} ≈ ${
    Number(revertRate) < 0.01 ? '< 0.01' : toPrecision(revertRate.toString(), 2)
  } ${toRealSymbol(tokenIn.symbol)}`;

  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    borderColor,
    iconDefault,
    iconHover,
  } = theme;

  return (
    <div
      className="__ref-widget-swap-detail-view __ref-swap-widget-col-flex-start"
      style={{
        color: secondary,
      }}
    >
      <div className="__ref-swap-widget-row-flex-center __ref-swap-widget-swap-detail-view-item">
        <div
          style={{
            color: primary,
            cursor: 'pointer',
          }}
          onClick={() => {
            setShowDetail(!showDetail);
          }}
        >
          Detail{' '}
          <span
            style={{
              position: 'relative',
              top: '2px',
            }}
          >
            {!showDetail ? <FiChevronDown /> : <FiChevronUp />}
          </span>
        </div>

        <div>
          {isRateReverse ? revertDisplayRate : displayRate}

          <RiExchangeFill
            onClick={() => {
              setIsRateReverse(!isRateReverse);
            }}
            size={16}
            style={{
              marginLeft: '4px',
              cursor: 'pointer',
              position: 'relative',
              top: '2px',
            }}
            fill={iconDefault}
          />
        </div>
      </div>
      {!showDetail ? null : (
        <>
          <div className="__ref-swap-widget-row-flex-center __ref-swap-widget-swap-detail-view-item">
            <div>Mimimum received</div>
            <div>{toPrecision(minReceived || '0', 8)}</div>
          </div>

          <div className="__ref-swap-widget-row-flex-center __ref-swap-widget-swap-detail-view-item">
            <div>Fee</div>

            <div>
              {`${calculateFeeCharge(fee, amountIn)} ${toRealSymbol(
                tokenIn.symbol
              )}(${toPrecision(calculateFeePercent(fee).toString(), 2)}%)`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const HalfAndMaxAmount = ({
  max,
  onChangeAmount,
  token,
  amount,
}: {
  max: string;
  token: TokenMetadata;
  onChangeAmount: (amount: string) => void;
  amount?: string;
}) => {
  const halfValue = percentOfBigNumber(50, max, token.decimals);

  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    borderColor,
  } = theme;

  const [hoverHalf, setHoverHalf] = useState<boolean>(false);
  const [hoverMax, setHoverMax] = useState<boolean>(false);

  return (
    <div className="__ref-swap-widget-token-amount_quick_selector __ref-swap-widget-row-flex-center">
      <span
        className="__ref-swap-widget-token-amount_quick_selector_item "
        style={{
          color: secondary,
          borderRadius,
          border: `1px solid ${borderColor}`,
          marginRight: '4px',

          background:
            amount === halfValue && !ONLY_ZEROS.test(halfValue)
              ? active
              : hoverHalf
              ? hover
              : 'transparent',
        }}
        onMouseEnter={() => setHoverHalf(true)}
        onMouseLeave={() => setHoverHalf(false)}
        onClick={() => {
          const half = percentOfBigNumber(50, max, token.decimals);

          onChangeAmount(half);
        }}
      >
        Half
      </span>

      <span
        className="__ref-swap-widget-token-amount_quick_selector_item"
        onClick={() => {
          onChangeAmount(max);
        }}
        onMouseEnter={() => setHoverMax(true)}
        onMouseLeave={() => setHoverMax(false)}
        style={{
          color: secondary,
          borderRadius,
          border: `1px solid ${borderColor}`,
          background:
            amount === max && !ONLY_ZEROS.test(max)
              ? active
              : hoverMax
              ? hover
              : 'transparent',
        }}
      >
        Max
      </span>
    </div>
  );
};

export const TokenAmount = (props: TokenAmountProps) => {
  const {
    balance,
    reloading,
    token,
    onSelectToken,
    amount,
    onChangeAmount,
    price,
  } = props;

  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    borderColor,
  } = theme;

  const ref = useRef<HTMLInputElement>(null);

  const [hoverSelect, setHoverSelect] = useState<boolean>(false);

  const handleChange = (amount: string) => {
    if (onChangeAmount) {
      onChangeAmount(amount);
    }
    if (ref.current) {
      ref.current.value = amount;
    }
  };
  return (
    <>
      <div
        className="__ref-swap-widger-token-amount "
        style={{
          background: secondaryBg,
        }}
      >
        <div
          className="__ref-swap-widget-row-flex-center __ref-swap-widget-token-amount_token-select-button"
          style={{
            color: primary,
            background: hoverSelect ? hover : 'transparent',
            border: `1px solide ${hoverSelect ? borderColor : 'transparent'}`,
          }}
          onClick={onSelectToken}
          onMouseEnter={() => setHoverSelect(true)}
          onMouseLeave={() => setHoverSelect(false)}
        >
          {!token ? (
            <span
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              Select Token
            </span>
          ) : (
            <>
              <img
                src={token?.icon}
                alt=""
                className="__ref-swap-widget_token_icon"
                style={{
                  height: '26px',
                  width: '26px',
                  marginRight: '8px',
                }}
              />
              {toRealSymbol(token?.symbol)}
            </>
          )}
          <FiChevronDown
            style={{
              marginLeft: '4px',
            }}
          />
        </div>
        <div className=" __ref-swap-widget-token-amount_input">
          <input
            ref={ref}
            max={balance || '0'}
            min="0"
            onWheel={() => {
              if (ref.current) {
                ref.current.blur();
              }
            }}
            className="__ref-swap-widget-input-class"
            step="any"
            value={amount}
            type="number"
            placeholder={!onChangeAmount ? '-' : '0.0'}
            onChange={({ target }) => handleChange(target.value)}
            disabled={!onChangeAmount}
            onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
            style={{
              color: primary,
              marginBottom: '8px',
              width: '100%',
              textAlign: 'right',
              fontSize: '20px',
            }}
          />

          <div
            style={{
              fontSize: '12px',
              color: secondary,
              textAlign: 'right',
            }}
          >
            {!price
              ? '$-'
              : '~$' +
                toInternationalCurrencySystemLongString(
                  multiply(price, amount || '0'),
                  2
                )}
          </div>
        </div>
      </div>

      {!balance || !token || !onChangeAmount ? null : (
        <div
          className="__ref-swap-widger-token-amount_balance __ref-swap-widget-row-flex-center"
          style={{
            fontSize: '12px',
            color: secondary,
          }}
        >
          <span>
            Balance:&nbsp;
            {toPrecision(balance, 2)}
          </span>
          {token && (
            <HalfAndMaxAmount
              token={token}
              max={balance}
              onChangeAmount={handleChange}
            />
          )}
        </div>
      )}
    </>
  );
};

export const SlippageSelector = ({
  slippageTolerance,
  onChangeSlippageTolerance,
  showSlip,
  setShowSlip,
}: {
  slippageTolerance: number;
  onChangeSlippageTolerance: (slippageTolerance: number) => void;
  showSlip: boolean;
  setShowSlip: (showSlip: boolean) => void;
}) => {
  const [autoHover, setAutoHover] = useState<boolean>(false);

  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    borderColor,
  } = theme;

  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (amount: string) => {
    onChangeSlippageTolerance(Number(amount));
    if (ref.current) {
      ref.current.value = amount;
    }
  };

  useEffect(() => {
    if (!showSlip) return;

    document.onclick = () => setShowSlip(false);

    return () => {
      document.onclick = null;
    };
  }, [showSlip]);

  if (!showSlip) return null;

  return (
    <div
      className="__ref-swap-widget_slippage_selector __ref-swap-widget-col-flex-start"
      onClick={e => e.stopPropagation()}
      style={{
        background: container,
      }}
    >
      <span
        style={{
          color: primary,
          paddingBottom: '14px',
        }}
      >
        Slippage tolerance
      </span>

      <div
        className={`__ref-swap-widget-row-flex-center
      `}
      >
        <div
          className={`__ref-swap-widget-row-flex-center
        __ref-swap-widget_slippage_selector_input_container`}
          style={{
            border: `1px solid ${borderColor}`,
            borderRadius,
          }}
        >
          <input
            ref={ref}
            max={99.99999}
            min={0.000001}
            defaultValue={slippageTolerance ? slippageTolerance : 0.5}
            onWheel={() => {
              if (ref.current) {
                ref.current.blur();
              }
            }}
            value={slippageTolerance}
            step="any"
            type="number"
            required={true}
            placeholder=""
            onChange={({ target }) => handleChange(target.value)}
            onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
            style={{
              width: '100%',
            }}
            className="__ref-swap-widget-input-class"
          />
          <span className="ml-2">%</span>
        </div>

        <button
          className="__ref-swap-widget_slippage_selector_button __ref-swap-widget-button"
          onMouseEnter={() => setAutoHover(true)}
          onMouseLeave={() => setAutoHover(false)}
          style={{
            color: primary,
            background: buttonBg,
            borderRadius,
            opacity: autoHover ? 0.5 : 1,
          }}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onChangeSlippageTolerance(0.5);
          }}
        >
          Auto
        </button>
      </div>
    </div>
  );
};

const StarToken = ({
  price,
  token,
  onDelete,
  onClick,
}: {
  token: TokenMetadata;
  price: string;
  onDelete: (token: TokenMetadata) => void;
  onClick: (token: TokenMetadata) => void;
}) => {
  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    borderColor,
    iconDefault,
    iconHover,
  } = theme;

  const [hoverIcon, setHoverIcon] = useState(false);

  const [hoverClose, setHoverClose] = useState(false);

  return (
    <div
      className="__ref-swap-widget_star_token __ref-swap-widget-row-flex-center"
      onMouseEnter={() => setHoverIcon(true)}
      onMouseLeave={() => setHoverIcon(false)}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClick(token);
      }}
      style={{
        background: hoverIcon ? hover : 'transparent',
        border: `1px solid ${borderColor}`,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(token);
        }}
        onMouseEnter={() => setHoverClose(true)}
        onMouseLeave={() => setHoverClose(false)}
      >
        <IoCloseCircle fill={hoverClose ? iconHover : iconDefault} />
      </span>
      <img
        src={token.icon}
        alt=""
        className="__ref-swap-widget_token_icon"
        style={{
          height: '26px',
          width: '26px',
        }}
      />

      <div className="__ref-swap-widget-col-flex-start">
        <span
          style={{
            fontSize: '14px',
            color: primary,
          }}
        >
          {toRealSymbol(token.symbol)}
        </span>

        <span
          style={{
            fontSize: '10px',
            color: secondary,
          }}
        >
          {!price
            ? '$-'
            : '$' + toInternationalCurrencySystemLongString(price, 2)}
        </span>
      </div>
    </div>
  );
};

interface TokenProps {
  token: TokenMetadata;
  onClick: (token: TokenMetadata) => void;
  onClickPin: (token: TokenMetadata) => void;
  balance: string;
  price?: string;
  isSticky?: boolean;
  index: number;
  setHoverIndex: (index: number) => void;
  hoverIndex: number;
}

const Token = ({
  token,
  onClick,
  price,
  balance,
  isSticky,
  onClickPin,
  index,
  setHoverIndex,
  hoverIndex,
}: TokenProps) => {
  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    borderColor,
    iconDefault,
    iconHover,
  } = theme;

  const displayBalance =
    0 < Number(balance) && Number(balance) < 0.001
      ? '< 0.001'
      : toPrecision(String(balance), 3);

  const [hoverOutLink, setHoverOutLink] = useState(false);

  const [hoverPin, setHoverPin] = useState(false);

  return (
    <div
      className="__ref-swap-widget_token-selector-token-list-item __ref-swap-widget-row-flex-center"
      style={{
        background: hoverIndex === index ? hover : 'transparent',
      }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClick(token);
      }}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(-1)}
    >
      <div
        className="__ref-swap-widget-row-flex-center"
        style={{
          justifyContent: 'space-between',
        }}
      >
        <img
          src={token.icon}
          alt=""
          className="__ref-swap-widget_token_icon"
          style={{
            height: '36px',
            width: '36px',
            marginRight: '10px',
          }}
        />

        <div className="__ref-swap-widget-col-flex-start">
          <span
            style={{
              fontSize: '14px',
              color: primary,
            }}
          >
            {toRealSymbol(token.symbol)}

            {TokenLinks[token.symbol] && (
              <HiOutlineExternalLink
                onMouseEnter={() => setHoverOutLink(true)}
                onMouseLeave={() => setHoverOutLink(false)}
                style={{
                  marginLeft: '4px',
                  marginTop: '2px',
                }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(TokenLinks[token.symbol], '_blank');
                }}
                stroke={hoverOutLink ? iconHover : iconDefault}
              />
            )}
          </span>

          <span
            style={{
              fontSize: '10px',
              color: secondary,
              marginTop: '4px',
            }}
          >
            {!price
              ? '$-'
              : '$' + toInternationalCurrencySystemLongString(price, 2)}
          </span>
        </div>
      </div>

      <div
        className="__ref-swap-widget-row-flex-center"
        style={{
          color: primary,
        }}
      >
        {displayBalance}

        {isSticky ? (
          <AiFillPushpin
            onMouseEnter={() => setHoverPin(true)}
            onMouseLeave={() => setHoverPin(false)}
            fill={hoverPin && hoverIndex == index ? iconHover : iconDefault}
            style={{
              marginLeft: '10px',
            }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onClickPin(token);
            }}
          />
        ) : (
          <AiOutlinePushpin
            style={{
              marginLeft: '10px',
            }}
            onMouseEnter={() => setHoverPin(true)}
            onMouseLeave={() => setHoverPin(false)}
            fill={hoverPin && hoverIndex == index ? iconHover : iconDefault}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onClickPin(token);
            }}
          />
        )}
      </div>
    </div>
  );
};

interface TokenListProps {
  tokens: TokenMetadata[];
  onClick: (token: TokenMetadata) => void;
  balances: { [tokenId: string]: string };
  tokenPriceList: Record<string, any> | null;
  starList: string[];
  setStarList: (starList: string[]) => void;
  onDelete: (token: TokenMetadata) => void;
}

export const TokenListTable = ({
  tokens,
  onClick,
  balances,
  tokenPriceList,
  starList,
  setStarList,
  onDelete,
}: TokenListProps) => {
  const [currentSort, setCurrentSort] = useState('down');
  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    borderColor,
    iconDefault,
    iconHover,
  } = theme;

  const onClickPin = (token: TokenMetadata) => {
    if (starList.includes(token.id)) {
      onDelete(token);
    } else {
      const newList = [...starList, token.id];
      setStarList(newList);
    }
  };

  const [hoverIndex, setHoverIndex] = useState(-1);

  const tokenSorting = (a: TokenMetadata, b: TokenMetadata) => {
    const v1 = starList.includes(a.id);
    const v2 = starList.includes(b.id);

    const b1 = balances[a.id];
    const b2 = balances[b.id];

    if (v1 && v2) {
      if (currentSort === 'up') {
        return Number(b1) - Number(b2);
      } else return Number(b2) - Number(b1);
    } else {
      if (v1) return -1;
      if (v2) return 1;
      return 0;
    }
  };

  return !tokens || tokens.length == 0 ? null : (
    <div className="__ref-swap-widget_token_list_table">
      <div
        className="__ref-swap-widget_token_list_table_header"
        style={{
          color: secondary,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <span className="">Asset</span>

        <span
          onClick={() => {
            setCurrentSort(currentSort === 'up' ? 'down' : 'up');
          }}
          style={{
            cursor: 'pointer',
          }}
          className="__ref-swap-widget-row-flex-center"
        >
          <span className="ml-1">Balance</span>
          {currentSort === 'up' ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </span>
      </div>

      <div className="__ref-swap-widget_token_list_table_content">
        {tokens.sort(tokenSorting).map((token, index) => (
          <Token
            key={token.id + '-select-token-list-item-' + index}
            onClick={onClick}
            index={index}
            token={token}
            price={tokenPriceList?.[token.id]?.price}
            balance={balances?.[token.id] || '0'}
            onClickPin={onClickPin}
            isSticky={starList.includes(token.id)}
            setHoverIndex={setHoverIndex}
            hoverIndex={hoverIndex}
          />
        ))}
      </div>
    </div>
  );
};

export const TokenSelector = ({
  onSelect,
  width,
  tokens,
  onClose,
  AccountId,
  balances,
}: {
  onSelect: (token: TokenMetadata) => void;
  width: string;
  tokens: TokenMetadata[];
  onClose: () => void;
  AccountId: string;
  balances: { [tokenId: string]: string };
}) => {
  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
    iconDefault,
    iconHover,
  } = theme;

  const [searchValue, setSearchValue] = useState<string>('');

  const tokenPriceList = useContext(TokenPriceContext);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const storagedStartList = localStorage.getItem(REF_WIDGET_STAR_TOKEN_LIST_KEY)
    ? JSON.parse(localStorage.getItem(REF_WIDGET_STAR_TOKEN_LIST_KEY) || '[]')
    : null;

  const [starList, setStarList] = useState<string[]>(
    storagedStartList || DEFAULT_START_TOKEN_LIST
  );

  const onDelete = (token: TokenMetadata) => {
    const newStarList = starList.filter(starToken => starToken !== token.id);

    setStarList(newStarList);

    localStorage.setItem(
      REF_WIDGET_STAR_TOKEN_LIST_KEY,
      JSON.stringify(newStarList)
    );
  };

  const tableListFilter = (token: TokenMetadata) => {
    if (!searchValue) return true;

    const searchValueLower = searchValue.toLowerCase();

    return (
      token.symbol?.toLowerCase().includes(searchValueLower) ||
      token.name?.toLowerCase().includes(searchValueLower)
    );
  };

  return (
    <div
      className="__ref-swap_widget-token_selector __ref-swap-widget-container"
      style={{
        position: 'relative',
        width,
      }}
    >
      <FiChevronLeft
        onClick={onClose}
        style={{
          position: 'absolute',
          cursor: 'pointer',
        }}
      />
      <div
        className="__ref-swap-widget-header-title __ref-swap-widget-row-flex-center"
        style={{
          color: primary,
          justifyContent: 'center',
          paddingBottom: '24px',
        }}
      >
        Select a token
      </div>

      <div
        className="__ref-swap-widget-select-token_input __ref-swap-widget-row-flex-center"
        style={{
          border: `1px solid ${buttonBg}`,
          background: secondaryBg,
        }}
      >
        <FaSearch
          fill={iconDefault}
          style={{
            marginRight: '8px',
          }}
        />

        <input
          className="__ref-swap-widget-input-class"
          placeholder="Search token..."
          onChange={evt => handleSearch(evt.target.value)}
          style={{
            fontSize: '14px',
          }}
        />
      </div>

      <div className="__ref-swap-widget_token-selector-star-tokens __ref-swap-widget-row-flex-center">
        {starList.map(id => {
          const token = tokens.find(token => token.id === id);

          return !token ? null : (
            <StarToken
              key={token.id + '-star-token'}
              token={token}
              price={tokenPriceList?.[token.id]?.price}
              onDelete={onDelete}
              onClick={onSelect}
            />
          );
        })}
      </div>

      <TokenListTable
        tokens={tokens.filter(tableListFilter)}
        tokenPriceList={tokenPriceList}
        onClick={onSelect}
        balances={balances}
        starList={starList}
        setStarList={setStarList}
        onDelete={onDelete}
      />
    </div>
  );
};

export const Slider = ({
  showSlip,
  setShowSlip,
}: {
  showSlip: boolean;
  setShowSlip: (show: boolean) => void;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setShowSlip(true)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6957 13.0652C12.6957 14.1338 11.8294 15 10.7609 15C9.69235 15 8.82611 14.1338 8.82611 13.0652C8.82612 11.9967 9.69235 11.1304 10.7609 11.1304C11.8294 11.1304 12.6957 11.9967 12.6957 13.0652ZM14.5749 12.0941C14.6145 12.0894 14.6548 12.0869 14.6957 12.0869L15.9565 12.0869C16.5088 12.0869 16.9565 12.5346 16.9565 13.0869C16.9565 13.6392 16.5088 14.0869 15.9565 14.0869L14.6957 14.0869C14.651 14.0869 14.6071 14.084 14.564 14.0783C14.1171 15.7605 12.5837 17 10.7609 17C8.93806 17 7.40472 15.7605 6.95777 14.0783C6.91471 14.084 6.87078 14.0869 6.82617 14.0869L1.00009 14.0869C0.447802 14.0869 8.61245e-05 13.6392 8.61728e-05 13.0869C8.62211e-05 12.5346 0.447802 12.0869 1.00009 12.0869L6.82617 12.0869C6.86702 12.0869 6.90729 12.0894 6.94686 12.0941C7.37926 10.3906 8.92291 9.13044 10.7609 9.13044C12.5989 9.13044 14.1425 10.3906 14.5749 12.0941ZM4.26086 3.93478C4.26086 2.86623 5.1271 2 6.19565 2C7.2642 2 8.13043 2.86623 8.13043 3.93478C8.13043 5.00333 7.2642 5.86957 6.19565 5.86957C5.1271 5.86956 4.26086 5.00333 4.26086 3.93478ZM6.19565 9.66601e-07C4.3728 8.07243e-07 2.83946 1.23952 2.39252 2.92168C2.34944 2.91601 2.3055 2.91309 2.26087 2.91309L0.999999 2.91309C0.447715 2.91309 -7.14972e-07 3.3608 -7.63254e-07 3.91309C-8.11537e-07 4.46537 0.447715 4.91309 0.999999 4.91309L2.26087 4.91309C2.30173 4.91309 2.34202 4.91063 2.3816 4.90587C2.81401 6.60936 4.35766 7.86956 6.19565 7.86957C8.03363 7.86957 9.57728 6.60936 10.0097 4.90588C10.0493 4.91064 10.0895 4.91309 10.1304 4.91309L15.9565 4.91309C16.5087 4.91309 16.9565 4.46537 16.9565 3.91309C16.9565 3.3608 16.5087 2.91309 15.9565 2.91309L10.1304 2.91309C10.0858 2.91309 10.0418 2.91601 9.99877 2.92167C9.55182 1.23952 8.01849 1.12596e-06 6.19565 9.66601e-07Z"
        fill={hover || showSlip ? '#00C6A2' : '#7E8A93'}
      />
    </svg>
  );
};

export const RefIcon = () => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.36365 10H10L6.36365 6.36363V10Z" fill="black" />
      <path
        d="M10 4.05312e-06L7.87879 3.86767e-06L10 2.12122L10 4.05312e-06Z"
        fill="#00C6A2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.51531 6.36364C6.46444 6.36364 6.41387 6.36232 6.36365 6.35971V4.08371L8.83901 1.78516C9.18802 2.26148 9.3941 2.8491 9.3941 3.48485C9.3941 5.07476 8.10522 6.36364 6.51531 6.36364ZM8.19255 1.14486L6.36365 2.84313V0.60999C6.41387 0.607383 6.46444 0.606064 6.51531 0.606064C7.14111 0.606064 7.72027 0.805743 8.19255 1.14486Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.06046 0.606064H3.33319V3.29661L4.55696 4.52039L6.06046 3.12428V0.606064ZM6.06046 4.36486L4.5336 5.78267L3.33319 4.58226V10H6.06046V4.36486Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.0303 0.606064H0V4.50881L2.27284 2.23598L3.0303 2.99344V0.606064ZM3.0303 4.27909L2.27284 3.52162L0 5.79446V10H3.0303V4.27909Z"
        fill="black"
      />
    </svg>
  );
};

export const Loading = () => {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="__ref-swap-widget-loading"
    >
      <circle
        cx="19"
        cy="19"
        r="16"
        stroke="#EEEEEE"
        stroke-width="6"
        stroke-linecap="round"
      />
      <path
        d="M19 35C27.8366 35 35 27.8366 35 19C35 10.1634 27.8366 3 19 3C10.1634 3 3 10.1634 3 19"
        stroke="#00C6A2"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  );
};

export const Warning = () => {
  return (
    <svg
      width="49"
      height="49"
      viewBox="0 0 49 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.0359 5.99999C22.5755 3.33333 26.4245 3.33333 27.9641 6L42.2535 30.75C43.7931 33.4167 41.8686 36.75 38.7894 36.75H10.2106C7.13137 36.75 5.20688 33.4167 6.74648 30.75L21.0359 5.99999Z"
        stroke="#FF689E"
        stroke-width="4"
        stroke-linecap="round"
      />
      <line
        x1="24"
        y1="14"
        x2="24"
        y2="24"
        stroke="#FF689E"
        stroke-width="4"
        stroke-linecap="round"
      />
      <circle cx="24" cy="30" r="2" fill="#FF689E" />
    </svg>
  );
};

export const Success = () => {
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <circle
          cx="19"
          cy="19"
          r="16"
          stroke="#EEEEEE"
          stroke-width="6"
          stroke-linecap="round"
        />
      </svg>

      <svg
        width="30"
        height="23"
        viewBox="0 0 30 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
        }}
      >
        <path
          d="M2 11.2727L10.4898 20L28 2"
          stroke="#00C6A2"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
};

export const Notification = ({
  state,
  tx,
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  open,
  setOpen,
}: {
  state: 'pending' | 'success' | 'fail' | null;
  setState: (state: 'pending' | 'success' | 'fail' | null) => void;
  tx?: string;
  tokenIn?: TokenMetadata;
  tokenOut?: TokenMetadata;
  amountIn: string;
  amountOut: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const theme = useContext(ThemeContext);
  const {
    container,
    buttonBg,
    primary,
    secondary,
    borderRadius,
    fontFamily,
    hover,
    active,
    secondaryBg,
  } = theme;

  if (!open) return null;

  return (
    <div
      className="__ref-swap-widget-notification"
      style={{
        color: primary,
        background: container,
      }}
    >
      <div className="__ref-swap-widget-notification__icon">
        {state === 'pending' && <Loading />}
        {state === 'fail' && <Warning />}
        {state === 'success' && <Success />}
      </div>

      <div
        style={{
          fontSize: '16px',
        }}
      >
        {state === 'success' && <p>Sucess!</p>}
        {state === 'fail' && <p>Swap Failed!</p>}
      </div>
      <div
        className="__ref-swap-widget-notification__text"
        style={{
          color: primary,
        }}
      >
        {state === 'pending' && <p>Waiting for confirmation</p>}
        {state === 'fail' && !!tx && (
          <p
            style={{
              textDecoration: 'underline',
              fontSize: '14px',
              position: 'relative',
              bottom: '20px',
            }}
          >
            Click to view.
          </p>
        )}

        {state === 'success' &&
          `Swap ${toPrecision(amountIn || '1', 2)} ${
            tokenIn?.symbol
          } for ${toPrecision(amountOut || '0', 3)} ${tokenOut?.symbol}`}
      </div>

      <button
        className="__ref-swap-widget-notification__button __ref-swap-widget-button"
        style={{
          background: buttonBg,
          fontWeight: 700,
          color: container,
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
      >
        Close
      </button>
    </div>
  );
};

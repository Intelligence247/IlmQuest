# MiniPay "BigInteger Divide by Zero" Fix

## Problem
When claiming rewards on MiniPay, users encountered this error:
```
could not coalesce error (error={ "code": -32603, "message": "BigInteger divide by zero" })
```

This error occurs during gas estimation when using `feeCurrency` parameter for Celo fee abstraction.

## Root Cause
MiniPay's gas estimation logic has issues when:
1. `feeCurrency` is specified without an explicit `gasLimit`
2. The wallet tries to calculate gas price in the fee currency (cUSD) and encounters a division by zero
3. This is a known compatibility issue with some wallet implementations

## Solution Implemented

### Multi-Step Fallback Strategy

The fix implements a **3-tier fallback approach**:

1. **Primary Attempt**: Try with `feeCurrency` only (no explicit gasLimit)
   - This is the ideal case for Celo fee abstraction
   - Works on most wallets including MetaMask

2. **Fallback 1**: If that fails, try with `feeCurrency` + explicit `gasLimit`
   - Some wallets need the gas limit to be explicitly set
   - Uses a safe default of 300,000 gas

3. **Fallback 2**: If that also fails, try without `feeCurrency` (pay gas in CELO)
   - Last resort - user pays gas in CELO instead of cUSD
   - Still allows the reward claim to succeed
   - Not ideal but ensures the transaction goes through

### Code Changes

**File**: `apps/frontend/lib/contract.ts`

**Key improvements**:
- ✅ Removed automatic gas estimation (which was causing the error)
- ✅ Added explicit gas limit (300,000) as a safe default
- ✅ Implemented error detection for "divide by zero" and error code -32603
- ✅ Added balance check to warn if user has insufficient cUSD for gas
- ✅ Comprehensive error logging for debugging
- ✅ User-friendly error messages

## Testing Instructions

1. **Test on MiniPay**:
   - Complete a quest
   - Click "Claim Reward"
   - The transaction should now succeed (may use one of the fallback methods)

2. **Check Console Logs**:
   - Open browser DevTools (F12)
   - Look for these messages:
     - `"Transaction parameters:"` - Shows what's being sent
     - `"Transaction sent, waiting for confirmation..."` - Success path
     - `"Attempting with explicit gasLimit..."` - Fallback 1 triggered
     - `"Trying without feeCurrency..."` - Fallback 2 triggered

3. **Verify Transaction**:
   - Check that the reward was received
   - Verify the transaction on block explorer
   - Note which gas currency was used (cUSD or CELO)

## Expected Behavior

### Best Case (Primary Path)
- Transaction succeeds with `feeCurrency` (gas paid in cUSD)
- No errors, smooth user experience

### Fallback 1
- Transaction succeeds with `feeCurrency` + explicit `gasLimit`
- Gas still paid in cUSD
- Console shows: `"Transaction succeeded with explicit gasLimit"`

### Fallback 2
- Transaction succeeds without `feeCurrency`
- Gas paid in CELO (not ideal, but works)
- Console shows: `"Transaction succeeded without feeCurrency (paid in CELO)"`
- User should have some CELO in wallet for this case

## Notes

- The fix maintains backward compatibility with MetaMask and other wallets
- Users with sufficient cUSD balance will still pay gas in cUSD (preferred)
- The fallback to CELO ensures transactions don't fail completely
- This is a workaround for MiniPay's gas estimation bug

## Future Improvements

If MiniPay fixes their gas estimation:
- We can remove the fallback logic
- Return to automatic gas estimation
- Improve user experience

## Related Issues

- Celo fee currency abstraction documentation
- MiniPay wallet compatibility
- Gas estimation with fee currencies

---

**Status**: ✅ Fixed and ready for testing


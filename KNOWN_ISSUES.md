# Known Issues

## DeprecatedFunctions

plugin DeprecatedFunctions in `plugins/deprecated_functions.ts` not finished yet.

## InsecureIntegerArithmetic
plugin InsecureIntegerArithmetic `plugins/insecure_integer_arithmetic` has bug.

run it with SWC test cases `integer_overflow_and_underflow/integer_overflow_multitx_multifunc_feasible.sol`, it will report line 16 and line 24 have SWC 101 issues. But actually just line 24 contains the issue.
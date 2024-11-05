# Hedera Starter Examples - JavaScript SDK

This repo shows how you can use the Hedera JavaScript SDK to use the main Hedera service. One example is included for each of the following:

- Hedera Consensus Service (HCS): [index-consensus.js](/index-consensus.js)
- Hedera Token Service (HTS): [index-token.js](index-token.js)
- Hedera Smart Contract Service (HSCS): [index-contract.js](/index-contract.js)

## Try It in Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/?autostart=true#https://github.com/ed-marquez/hedera-example-backpocket-demos)

1.  Add your [Hedera testnet credentials](https://portal.hedera.com/dashboard) in the `.env` file. Be sure to use your account with ECDSA keys.

2.  Run the examples for each Hedera service!
    | Hedera Consensus Service (HCS) | Hedera Token Service (HTS) | Hedera Smart Contract Service (HSCS) |
    | ----------------------------------------- | ------------------------------------- | ---------------------------------------- |
    | `node index-consensus.js` | `node index-token.js` | `node index-contract.js` |
    | ![alt text](/assets/consensus-result.png) | ![alt text](/assets/token-result.png) | ![alt text](/assets/contract-result.png) |

## Local Setup

1. Clone the repository

   ```bash
   git clone https://github.com/ed-marquez/hedera-example-backpocket-demos.git
   ```

2. Copy `.env.sample` to `.env` and add your environment variables (and Hedera testnet credentials). Be sure to use your account with ECDSA keys.
   ```bash
   cp .env.example .env
   ```
3. Install dependencies with `npm`
   ```bash
   npm install
   ```
4. Run the examples!
   | Hedera Consensus Service (HCS) | Hedera Token Service (HTS) | Hedera Smart Contract Service (HSCS) |
   | ----------------------------------------- | ------------------------------------- | ---------------------------------------- |
   | `node index-consensus.js` | `node index-token.js` | `node index-contract.js` |
   | ![alt text](/assets/consensus-result.png) | ![alt text](/assets/token-result.png) | ![alt text](/assets/contract-result.png) |

## References

- [Hedera Documentation](https://docs.hedera.com/hedera)
- [Hedera Consensus Service (HCS) Documentation](https://docs.hedera.com/hedera/sdks-and-apis/sdks/consensus-service)
- [Hedera Token Service (HTS) Documentation](https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service)
- [Hedera Smart Contract Documentation (SDK)](https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts)

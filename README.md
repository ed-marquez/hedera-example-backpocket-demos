# Hedera Starter Examples

These are starter examples that show how to use the Hedera services with the JS SDK.

## Try It in Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/?autostart=true#https://github.com/ed-marquez/hedera-example-backpocket-demos)

## Local Setup

1. Clone the repository

   ```bash
   git clone https://github.com/ed-marquez/hedera-example-backpocket-demos.git
   ```

2. Copy `.env.sample` to `.env` and add your environment variables (and Hedera testnet credentials)
   ```bash
   cp .env.example .env
   ```
3. Install dependencies with `npm`
   ```bash
   npm install
   ```
4. Run the examples!
   ```bash
   node index-consensus.js
   ```
   ```bash
   node index-token.js
   ```
   ```bash
   node index-contract.js
   ```

## References

- [Hedera Documentation](https://docs.hedera.com/hedera)

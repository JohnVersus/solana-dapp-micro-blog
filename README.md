## Installation and Local environment setup

---

### `Rust Installation & Setup`

Run the following command in Unix terminal to install rust and cargo.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Once installed setup locla env PATH as instructed after the installation process.

`Refer` [Rustup docs](https://rustup.rs/) `for installing rust on windows machine.`

---

### `Solana Installation & Setup`

Install the solana CLI and the set the local env PATH.

```bash
  sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

Create a new Solana keypair

```bash
mkdir ~/my-solana-wallet

solana-keygen new --outfile ~/my-solana-wallet/my-keypair.json
```

Set devet cluster to use with local transactions

```bash
solana config set --url https://api.devnet.solana.com
```

Airdrop wallet with devent Solana

```bash
solana airdrop 1
```

`Refer` [Solana docs](https://docs.solana.com/cli/install-solana-cli-tools) `for more command related to solana CLI and for installing the same on windows machine.`

---

### `Hello World Solana Program`

Start a new rust library project using

```bash
cargo init hello_world --lib

cd hello_world
```

Update `Cargo.toml` file with required rust library configurations

```
[lib]
name = "hello_world"
crate-type = ["cdylib", "lib"]
```

Install the `solana_program` package using

```
cargo add solana_program
```

Hello World Program

```rs
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    msg!("Hello, world!");

    Ok(())
}
```

Build the Solana Rust Program using

```bash
cargo build-bpf
```

Once built successfully without any error `.so` of the program will be added to the `/target/deploy` folder. You can deploy this to solana cluster using.

```
solana program deploy ./target/deploy/hello_world.so
```

Once successfully deployed it will return the programId of the Solana Program.

### `Testing in frontend`

📄 Clone the repo:

```sh
git clone https://github.com/johnvsnagendra/solana-smart-contract-helloWorld.git
```

💿 Install all dependencies:

```sh
cd solana-smart-contract-helloWorld
yarn install
```

✏ Rename `.env.local.example` to `.env.local` and provide required data. Get your Web3 Api Key from the [Moralis dashboard](https://admin.moralis.io/):

![image](https://user-images.githubusercontent.com/78314301/186810270-7c365d43-ebb8-4546-a383-32983fbacef9.png)

➕ Add the program Id in `src/components/templates/helloWorld/HelloWorld.tsx`

🚴‍♂️ Run your App:

```sh
yarn run dev
```

---

<br/>
<details>
  <summary>Ethereum BoilerPlate Docs</summary>

# `ethereum-boilerplate`

> Fully Typescript ready NextJS components for fast building dApps without running own backend

🚀DEMO: https://eth-boilerplate.vercel.app/

This boilerplate is built with [Moralis](https://moralis.io?utm_source=github&utm_medium=readme&utm_campaign=ethereum-boilerplate)

You need active web3 provider/wallet only for authnetication. All pages in this boilerplate do not require an active web3 provider, they use Moralis Web3 API. Moralis supports the most popular blockchains and their test networks. You can find a list of all available networks in [Moralis Supported Chains](https://docs.moralis.io/reference/supported-chains-nft)

Please check the [official documentation of Moralis](https://docs.moralis.io/) for all the functionalities of Moralis.

![eth-boilerplate](https://user-images.githubusercontent.com/78314301/186810447-fa66cd80-5bbb-4e41-b29f-862c8cc67d43.gif)

# ⭐️ `Star us`

If this boilerplate helps you build Ethereum dapps faster - please star this project, every star makes us very happy!

# 🤝 `Need help?`

If you need help with setting up the boilerplate or have other questions - don't hesitate to write in our community forum and we will check asap. [Forum link](https://forum.moralis.io/t/ethereum-boilerplate-questions/3951/86). The best thing about this boilerplate is the super active community ready to help at any time! We help each other.

# 🚀 `Quick Start`

📄 Clone or fork `ethereum-boilerplate`:

```sh
git clone https://github.com/ethereum-boilerplate/ethereum-boilerplate.git
```

💿 Install all dependencies:

```sh
cd ethereum-boilerplate
yarn install
```

✏ Rename `.env.local.example` to `.env.local` and provide required data. Get your Web3 Api Key from the [Moralis dashboard](https://admin.moralis.io/):

![image](https://user-images.githubusercontent.com/78314301/186810270-7c365d43-ebb8-4546-a383-32983fbacef9.png)

🚴‍♂️ Run your App:

```sh
yarn start
```

# 🧭 `Table of contents`

- [`ethereum-boilerplate`](#ethereum-boilerplate)
- [🚀 Quick Start](#-quick-start)
- [🧭 Table of contents](#-table-of-contents)
- [🏗 Ethereum Components](#-ethereum-components)
  - [`<NFTBalances />`](#nftbalances-)
  - [`<ERC20Balances />`](#erc20balances-)
  - [`<ERC20Transfers />`](#erc20transfers-)
  - [`<NFTTransfers />`](#nfttransfers-)
  - [`<Transactions />`](#transactions-)

# 🏗 Ethereum Components

### `<NFTBalances />`

![image](https://user-images.githubusercontent.com/78314301/186813114-2b2265a5-5177-4ab8-9076-588107d450f1.png)

location: `src/component/templates/balances/NFT/NFTBalances.tsx`

🎨 `<NFTBalances />` : displays the the user's balances. Uses Moralis Evm API (does not require an active web3 provider).

### `<ERC20Balances />`

![image](https://user-images.githubusercontent.com/78314301/186813448-a0b63106-bcba-46d2-be80-3a7d962e2302.png)

location: `src/component/templates/balances/ERC20/ERC20Balances.tsx`

💰 `<ERC20Balances />` : displays the user's ERC20 balances. Uses Moralis Evm API (does not require an active web3 provider).

### `<ERC20Transfers />`

![image](https://user-images.githubusercontent.com/78314301/186813957-69badb89-bf93-44e6-90e7-c35801c24d9a.png)

location: `src/component/templates/transfers/ERC20/ERC20Transfers.tsx`

💰 `<ERC20Transfers />` : displays the user's ERC20 transfers. Uses Moralis Evm API (does not require an active web3 provider).

### `<NFTTransfers />`

![image](https://user-images.githubusercontent.com/78314301/186814187-916851d7-703d-4e30-9b28-b66b0bea90b1.png)

location: `src/component/templates/transfers/NFT/NFTTransfers.tsx`

🎨 `<NFTTransfers />` : displays the user's NFT transfers. Uses Moralis Evm API (does not require an active web3 provider).

### `<Transactions />`

![image](https://user-images.githubusercontent.com/78314301/186812987-74d8e534-5171-4a53-83f9-3b470bc97e63.png)

location: `src/component/templates/transactions/Transactions.tsx`

💰 `<Transactions />` : displays the user's transactions. Uses Moralis Evm API (does not require an active web3 provider).

</details>

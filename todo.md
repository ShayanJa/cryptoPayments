const mnemonic = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
const wallet = ethers.Wallet.fromMnemonic(mnemonic);

// Generate multiple private keys by deriving paths
const paths = [
  "m/44'/60'/0'/0/0", // primary account
  "m/44'/60'/1'/0/0", // second account
  "m/44'/60'/2'/0/0", // third account
  // ...
];

const privateKeys = [];
for (const path of paths) {
  const derivedWallet = wallet.derivePath(path);
  privateKeys.push(derivedWallet.privateKey);
}
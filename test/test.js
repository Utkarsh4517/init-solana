const solanaWeb3 = require('@solana/web3.js');

(async () => {
  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

  const payer = solanaWeb3.Keypair.generate();
  const airdropSignature = await connection.requestAirdrop(payer.publicKey, solanaWeb3.LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSignature);

  const newAccount = solanaWeb3.Keypair.generate();
  const programId = new solanaWeb3.PublicKey('8VcNq6M2G65kPMk5ickn7FDpyJY67uVawcJESzDnctTo');

  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(1),
      space: 1,
      programId: programId,
    }),
  );

  await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer, newAccount]);

  const instruction = new solanaWeb3.TransactionInstruction({
    keys: [{ pubkey: newAccount.publicKey, isSigner: false, isWritable: true }],
    programId: programId,
    data: Buffer.alloc(0),
  });

  const tx = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    new solanaWeb3.Transaction().add(instruction),
    [payer],
  );

  console.log('Transaction signature', tx);

  const accountInfo = await connection.getAccountInfo(newAccount.publicKey);
  console.log('Account data (raw): ', accountInfo.data);

  // Decode the buffer data
  const data = accountInfo.data;
  const value = data[0];
  console.log('Decoded account value:', value);
})();

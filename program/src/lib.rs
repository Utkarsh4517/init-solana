
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
};

// This line of code defines the entrypoint of the program.
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult{
    msg!("Hello Solana part of the world!");

    // Initialize the account
    let account = &accounts[0];

    if account.owner != program_id {
        msg!("This account is not owned by the program");
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut data = account.try_borrow_mut_data()?;
    data[0] = 50;

    msg!("Account initialized with value: {}", data[0]);

    Ok(())
}
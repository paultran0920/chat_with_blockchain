import contract from '@truffle/contract';

export const loadContract = async (name, provider) => {
    const rs = await fetch(`/contracts/${name}.json`);
    const _contract = contract(await rs.json());
    _contract.setProvider(provider);

    return await _contract.deployed();
}

# A simple chat messager based on Blockchain for DEMO


## DEMO
https://drive.google.com/file/d/1YkdHHpdbMT_IhUVT8o8fiit4uNDIfjqr/view?usp=sharing

## Prepare
1. [Node is installed](https://nodejs.org/en/download)
2. [Truffle is installed](https://trufflesuite.com/docs/truffle/how-to/install/)
3. [Ganache is installed](https://trufflesuite.com/ganache/)
4. Install Metamask browser extension
5. Add new Ganache network and connect to it
6. Import Ganache and import 1 2 accounts to Metamask

## Testing
```
cd backend
truffle test
```
You can also test manually the contract on http://remix.ethereum.org/ 

## Deployment
Start the Ganache server first
```
cd backend
truffle migrate # it will deploy the contract to Ganache
```

# Compile for Frontend
```
truffle build # It will compile and copy the compiled to /frontend/public/contracts
```

# Testing on UI
Start the React app then play around with it

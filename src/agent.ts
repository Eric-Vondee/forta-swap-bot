import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType}  from 'forta-agent'

export const CREATE_PAIR_EVENT= ["event PairCreated(address indexed token0, address indexed token1, address pair, uint)"]
let ABI = "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
export const FACTORY_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
let pairCounts = 0;

const handlePair:HandleTransaction = async(txEvent: TransactionEvent) => {
    const findings : Finding[] = [];
    if(pairCounts >= 10) return findings;

    const filterFunction = txEvent.filterFunction(ABI, FACTORY_ADDRESS);

    for(const swap of filterFunction){
        const {address} = swap
        findings.push(
            Finding.fromObject({
                name: "Swap Bot",
                description: `Swap Tokens for Tokens`,
                alertId: "FORTA-1",
                severity: FindingSeverity.Low,
                type: FindingType.Info,
                metadata: {
                    address
                },
            })
        )
        pairCounts++
    }
    return findings;
}

export default{
    handleTransaction: handlePair
}
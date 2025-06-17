import { fullDateAndTime, amountFormatNode, addressUsernameOrServiceLink, niceCurrency } from '../../utils/format'

export default function IOUData({ rippleStateList, ledgerTimestamp }) {
  //show the section only if there are tokens to show
  if (!rippleStateList?.length) return ''

  const title = ledgerTimestamp ? (
    <span className="red bold">Historical Token data ({fullDateAndTime(ledgerTimestamp)})</span>
  ) : (
    'Tokens (IOUs)'
  )

  const statusNode = !rippleStateList ? 'Loading...' : <span>There are {rippleStateList?.length} tokens</span>

  // console.log(rippleStateList) //delete

  /*
  [
    {
        "Balance": {
            "currency": "EUR",
            "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
            "value": "0"
        },
        "Flags": 2228224,
        "HighLimit": {
            "currency": "EUR",
            "issuer": "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
            "value": "1000000000",
            "issuerDetails": {
                "address": "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
                "username": null,
                "service": "XRPL-Labs"
            }
        },
        "HighNode": "1",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
            "currency": "EUR",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "0",
            "issuerDetails": {
                "address": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
                "username": "gatehub",
                "service": "GateHub Crypto"
            }
        },
        "LowNode": "1d3b",
        "PreviousTxnID": "089783179C2C22C8B511F760C49BA78336FFA7C6E3CB13BDC72D906C36A84DF3",
        "PreviousTxnLgrSeq": 96124408,
        "index": "1AEA98113F835CA0CAFFA2355F5B280A95AF6D312180053453E462AE73242202",
        "flags": {
            "lowReserve": false,
            "highReserve": true,
            "lowAuth": false,
            "highAuth": false,
            "lowNoRipple": false,
            "highNoRipple": true,
            "lowFreeze": false,
            "highFreeze": false,
            "ammNode": false,
            "lowDeepFreeze": false,
            "highDeepFreeze": false
        },
        "previousTxAt": 1747261031
    }
  ]
  */

  // amount / gateway details / trustline settings

  const tokenRows = rippleStateList.map((tl, i) => {
    // Figure out which side of the trustline is the counterparty (issuer)
    // If current account address is HighLimit.issuer then the counterparty is LowLimit.issuer and vice-versa.
    const issuerAddress = tl.HighLimit?.issuer

    // Prepare balance object compatible with amountFormatNode helper
    const balanceObj = {
      value: tl.Balance?.value,
      currency: tl.Balance?.currency,
      issuer: tl.Balance?.issuer
    }

    // Build a simple string that lists the most important flags for quick visibility
    const activeFlags = []
    if (tl.flags?.lowFreeze || tl.flags?.highFreeze) activeFlags.push('Freeze')
    if (tl.flags?.lowNoRipple || tl.flags?.highNoRipple) activeFlags.push('NoRipple')
    if (tl.flags?.lowAuth || tl.flags?.highAuth) activeFlags.push('Auth')
    if (tl.flags?.lowReserve || tl.flags?.highReserve) activeFlags.push('Reserve')

    return (
      <tr key={i}>
        <td className="center" style={{ width: 30 }}>{i + 1}</td>
        <td>{niceCurrency(tl.Balance?.currency)}</td>
        <td className="right">{amountFormatNode(balanceObj)}</td>
        <td>{addressUsernameOrServiceLink({ issuer: issuerAddress }, 'issuer', { short: true })}</td>
        <td className="right">{activeFlags.join(', ') || <span className="grey">—</span>}</td>
      </tr>
    )
  })

  return (
    <>
      <table className="table-details hide-on-small-w800">
        <thead>
          <tr>
            <th colSpan="100">{title}</th>
          </tr>
          <tr>
            <th>#</th>
            <th>Currency</th>
            <th className="right">Balance</th>
            <th>Issuer</th>
            <th className="right">Flags</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Status</td>
            <td>{statusNode}</td>
          </tr>
          {tokenRows}
        </tbody>
      </table>
      <div className="show-on-small-w800">
        <br />
        <center>{title}</center>
        <p>
          <span className="grey">Status</span> {statusNode}
        </p>
        {rippleStateList.map((tl, i) => {
          const issuerAddress = tl.HighLimit?.issuer
          const balanceObj = {
            value: tl.Balance?.value,
            currency: tl.Balance?.currency,
            issuer: tl.Balance?.issuer
          }
          const activeFlags = []
          if (tl.flags?.lowFreeze || tl.flags?.highFreeze) activeFlags.push('Freeze')
          if (tl.flags?.lowNoRipple || tl.flags?.highNoRipple) activeFlags.push('NoRipple')
          if (tl.flags?.lowAuth || tl.flags?.highAuth) activeFlags.push('Auth')
          if (tl.flags?.lowReserve || tl.flags?.highReserve) activeFlags.push('Reserve')

          return (
            <div key={i} style={{ marginBottom: '6px' }} suppressHydrationWarning>
              <span className="grey">{i + 1}. </span>
              {niceCurrency(tl.Balance?.currency)} — {amountFormatNode(balanceObj)}{' '}
              ({addressUsernameOrServiceLink({ issuer: issuerAddress }, 'issuer', { short: true })})
              {activeFlags.length > 0 && <span className="grey"> — {activeFlags.join(', ')}</span>}
            </div>
          )
        })}
      </div>
      <style jsx>{``}</style>
    </>
  )
}

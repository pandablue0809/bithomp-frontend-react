import { fullDateAndTime, addressUsernameOrServiceLink } from '../../utils/format'
import { amountFormatNode } from '../../utils/format'
import { nativeCurrency } from '../../utils'

export default function EscrowData({ escrowList, ledgerTimestamp }) {
  //show the section only if there are escrows to show
  if (!escrowList?.length) return ''

  const title = ledgerTimestamp ? (
    <span className="red bold">Historical Escrow data ({fullDateAndTime(ledgerTimestamp)})</span>
  ) : (
    'Escrows'
  )

  // const statusNode = !escrowList ? 'Loading...' : <span>There are {escrowList?.length} escrows</span>
  console.log(escrowList) //delete
  const escrowRows = escrowList.map((escrow, i) => {
    // Prepare amount object compatible with amountFormatNode helper
    const amountObj = {
      value: escrow.Amount.value || escrow.Amount,
      currency: escrow.Amount.currency || nativeCurrency
    }

    return (
      <tr key={i}>
        <td className="center" style={{ width: 30 }}>{i + 1}</td>
        <td>{addressUsernameOrServiceLink({ address: escrow.Account }, 'address', { short: true })}</td>
        <td>{addressUsernameOrServiceLink({ address: escrow.Destination }, 'address', { short: true })}</td>
        <td className="right">{amountFormatNode(amountObj)}</td>
        <td>{fullDateAndTime(escrow.FinishAfter, 'ripple')}</td>
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
            <th>Owner</th>
            <th>Destination</th>
            <th className="right">Amount</th>
            <th>Finish After</th>
          </tr>
        </thead>
        <tbody>
          {escrowRows}
        </tbody>
      </table>
      <div className="show-on-small-w800">
        <br />
        <center>{title}</center>
        {escrowList.map((escrow, i) => {
          const amountObj = {
            value: escrow.Amount.value || escrow.Amount,
            currency: escrow.Amount.currency || nativeCurrency
          }

          return (
            <div key={i} style={{ marginBottom: '6px' }} suppressHydrationWarning>
              <span className="grey">{i + 1}. </span>
              {addressUsernameOrServiceLink({ address: escrow.Account }, 'address', { short: true })} →{' '}
              {addressUsernameOrServiceLink({ address: escrow.Destination }, 'address', { short: true })}
              <br />
              <span className="grey">Amount: </span>
              {amountFormatNode(amountObj)}
              <br />
              <span className="grey">Finish After: </span>
              {fullDateAndTime(escrow.FinishAfter, 'ripple')}
            </div>
          )
        })}
      </div>
      <style jsx>{``}</style>
    </>
  )
}

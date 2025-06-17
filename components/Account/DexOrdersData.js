import { fullDateAndTime, addressUsernameOrServiceLink, amountFormatNode } from '../../utils/format'
import { nativeCurrency } from '../../utils'

export default function DexOrdersData({ offerList, ledgerTimestamp }) {
  //show the section only if there are dex orders to show
  if (!offerList?.length) return ''

  const title = ledgerTimestamp ? (
    <span className="red bold">Historical DEX orders data ({fullDateAndTime(ledgerTimestamp)})</span>
  ) : (
    'DEX orders'
  )

  // const statusNode = !offerList ? 'Loading...' : <span>There are {offerList?.length} DEX orders</span>

  const orderRows = offerList.map((offer, i) => {
    // Prepare amount objects compatible with amountFormatNode helper
    const takerGetsObj = {
      value: offer.TakerGets.value || offer.TakerGets,
      currency: offer.TakerGets.currency || nativeCurrency,
      issuer: offer.TakerGets.issuer
    }

    const takerPaysObj = {
      value: offer.TakerPays.value || offer.TakerPays,
      currency: offer.TakerPays.currency || nativeCurrency,
      issuer: offer.TakerPays.issuer
    }

    return (
      <tr key={i}>
        <td className="center" style={{ width: 30 }}>{i + 1}</td>
        <td>{addressUsernameOrServiceLink({ address: offer.Account }, 'address', { short: true })}</td>
        <td className="right">{amountFormatNode(takerGetsObj)}</td>
        <td className="right">{amountFormatNode(takerPaysObj)}</td>
        <td>{offer.flags?.sell ? 'Sell' : 'Buy'}</td>
        <td>{offer.flags?.passive ? 'Passive' : 'Active'}</td>
        <td>{fullDateAndTime(offer.previousTxAt)}</td>
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
            <th>Account</th>
            <th className="right">Taker Gets</th>
            <th className="right">Taker Pays</th>
            <th>Type</th>
            <th>Flags</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orderRows}
        </tbody>
      </table>
      <div className="show-on-small-w800">
        <br />
        <center>{title}</center>
        {offerList.map((offer, i) => {
          const takerGetsObj = {
            value: offer.TakerGets.value || offer.TakerGets,
            currency: offer.TakerGets.currency || nativeCurrency,
            issuer: offer.TakerGets.issuer
          }

          const takerPaysObj = {
            value: offer.TakerPays.value || offer.TakerPays,
            currency: offer.TakerPays.currency || nativeCurrency,
            issuer: offer.TakerPays.issuer
          }

          return (
            <div key={i} style={{ marginBottom: '6px' }} suppressHydrationWarning>
              <span className="grey">{i + 1}. </span>
              {addressUsernameOrServiceLink({ address: offer.Account }, 'address', { short: true })}
              <br />
              <span className="grey">Taker Gets: </span>
              {amountFormatNode(takerGetsObj)}
              <br />
              <span className="grey">Taker Pays: </span>
              {amountFormatNode(takerPaysObj)}
              <br />
              <span className="grey">Type: </span>
              {offer.flags?.sell ? 'Sell' : 'Buy'}
              <br />
              <span className="grey">Flags: </span>
              {offer.flags?.passive ? 'Passive' : 'Active'}
              <br />
              <span className="grey">Created: </span>
              {fullDateAndTime(offer.previousTxAt)}
            </div>
          )
        })}
      </div>
      <style jsx>{``}</style>
    </>
  )
}

import { useState, useEffect } from 'react'
import { fullDateAndTime, timeOrDate, amountFormat, addressUsernameOrServiceLink } from '../../utils/format'
import { LinkTx } from '../../utils/links'
// import { FiDownload, FiUpload } from 'react-icons/fi';
import axios from 'axios'

export default function RecentTransactions({ userData, ledgerTimestamp }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const address = userData?.address

  const historicalTitle = ledgerTimestamp ? (
    <span className="red bold"> Historical data ({fullDateAndTime(ledgerTimestamp)})</span>
  ) : (
    ''
  )

  const fetchTransactions = async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    const res = await axios(
      `/v3/transactions/${address}?limit=5&excludeFailures=1` +
        (ledgerTimestamp ? '&toDate=' + new Date(ledgerTimestamp).toISOString() : '')
    ).catch((error) => {
      setError(error.message)
      setLoading(false)
    })
    const transactions = Array.isArray(res?.data) ? res.data : res?.data?.transactions
    setTransactions(transactions || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!transactions?.length) {
    return null
  }
  console.log(transactions)

  return (
    <>
      <table className="table-details hide-on-small-w800">
        <thead>
          <tr>
            <th colSpan="100">
              Last 5 transactions [<a href={'/explorer/' + address}>View all</a>]{historicalTitle}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="100">Loading recent transactions...</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan="100" className="red">
                Error: {error}
              </td>
            </tr>
          )}
          {!loading && !error && (
            <>
              <tr>
                <th>#</th>
                <th className="right">Validated</th>
                <th className="right">Type</th>
                <th className="right">Hash</th>
                <th className="right">Balance changes</th>
              </tr>
              {transactions.map((txdata, i) => (
                <tr key={txdata.tx?.hash || i}>
                  <td className="center" style={{ width: 30 }}>
                    {i + 1}
                  </td>
                  <td className="right">{txdata.tx?.date ? timeOrDate(txdata.tx.date, 'ripple') : '-'}</td>
                  <td className="right">{txdata.tx?.TransactionType}</td>
                  <td className="right">
                    <LinkTx tx={txdata.tx?.hash} icon={true} />
                  </td>
                  <td className="right">
                    {txdata.outcome?.balanceChanges?.find((change) => change.address === address)?.balanceChanges?.map((change, index, array) => {
                      return (
                        <span key={index}>
                          <span className={change.value > 0 ? 'green bold tooltip' : 'red bold tooltip'}>
                            {amountFormat(change, { short: true, maxFractionDigits: 2 })}
                            <span className="tooltiptext no-brake">{amountFormat(change)} {addressUsernameOrServiceLink(change, 'issuer')}</span>
                          </span>
                          {index < array.length - 1 && <span>, </span>}
                        </span>
                      )
                    })}
                  </td>                  
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      <div className="show-on-small-w800">
        <br />
        <center>
          {'Last 5 Transactions'.toUpperCase()} [<a href={'/explorer/' + address}>View all</a>]{historicalTitle}
        </center>
        <br />
        {loading && <span className="grey">Loading recent transactions...</span>}
        {error && <span className="red">Error: {error}</span>}
        {!loading && !error && transactions.length > 0 && (
          <table className="table-mobile wide">
            <tbody>
              <tr>
                <th>#</th>
                <th className="right">Validated</th>
                <th className="right">Type</th>
                <th className="center">Link</th>
                <th className="center">Balance changes</th>
              </tr>
              {transactions.map((txdata, i) => (
                <tr key={txdata.tx?.hash || i}>
                  <td className="center" style={{ width: 30 }}>
                    {i + 1}
                  </td>
                  <td className="right">{txdata.tx?.date ? timeOrDate(txdata.tx.date, 'ripple') : '-'}</td>
                  <td className="right">{txdata.tx?.TransactionType}</td>
                  <td className="center">
                    <LinkTx tx={txdata.tx?.hash} icon={true} />
                  </td>
                  <td className="center">
                    {txdata.outcome?.balanceChanges?.find((change) => change.address === address)?.balanceChanges?.map((change, index, array) => {
                      return (
                        <span key={index}>
                          <span className={change.value > 0 ? 'green bold tooltip' : 'red bold tooltip'}>
                            {amountFormat(change, { short: true, maxFractionDigits: 2 })}
                            <span className="tooltiptext no-brake">{amountFormat(change)} {addressUsernameOrServiceLink(change, 'issuer')}</span>
                          </span>
                          {index < array.length - 1 && <span>, </span>}
                        </span>
                      )
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

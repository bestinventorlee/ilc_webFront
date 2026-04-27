import { useEffect, useMemo, useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { getUser, saveUser } from '../utils/token'
import { getMemberships } from '../services/membershipService'
import {
  getMyProfile,
  getMyTokenTransfers,
  saveMyWalletAddress,
  sendMyToken,
  type MyTokenTransfer,
} from '../services/authService'
import type { Membership as MembershipType } from '../types/membership'
import './TokenWallet.css'

const createWalletAddress = (seed: string) => {
  const base = seed || `guest-${Date.now()}`
  let hash = 0

  for (let i = 0; i < base.length; i += 1) {
    hash = (hash << 5) - hash + base.charCodeAt(i)
    hash |= 0
  }

  const normalized = Math.abs(hash).toString(16).padStart(8, '0')
  const tail = `${base}${normalized}`.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return `0x${(tail + normalized.repeat(6)).slice(0, 40)}`
}

const shortenAddress = (address: string) => `${address.slice(0, 8)}...${address.slice(-6)}`

const formatTransferDate = (iso: string) =>
  new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const transferStatusLabel = (status: MyTokenTransfer['status']) => {
  switch (status) {
    case 'pending':
      return '대기'
    case 'success':
      return '완료'
    case 'failed':
      return '실패'
    default:
      return status
  }
}

const shortenTxHash = (hash?: string) =>
  hash && hash.length > 14 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash || '-'
const PRIVY_ENABLED = Boolean(import.meta.env.VITE_PRIVY_APP_ID)

const PrivyWalletConnector = ({ onWalletSaved }: { onWalletSaved: (address: string) => void }) => {
  const { ready, authenticated, login } = usePrivy()
  const { wallets } = useWallets()

  const embeddedWalletAddress = useMemo(
    () => wallets.find((w) => w.walletClientType === 'privy')?.address ?? wallets[0]?.address ?? '',
    [wallets]
  )

  return (
    <div className="wallet-panel">
      <h3>Privy 지갑 연결</h3>
      {!ready ? (
        <p className="wallet-muted">Privy 초기화 중...</p>
      ) : !authenticated ? (
        <button
          type="button"
          className="wallet-connect-btn"
          onClick={() => login()}
        >
          Privy 로그인/지갑 생성
        </button>
      ) : embeddedWalletAddress ? (
        <>
          <p className="wallet-success">연결된 Privy 지갑: {shortenAddress(embeddedWalletAddress)}</p>
          <button
            type="button"
            className="wallet-connect-btn"
            onClick={() => onWalletSaved(embeddedWalletAddress)}
          >
            이 주소를 내 지갑으로 저장
          </button>
        </>
      ) : (
        <p className="wallet-muted">Privy 지갑 주소를 찾지 못했습니다.</p>
      )}
    </div>
  )
}

const TokenWallet = () => {
  const location = useLocation()
  const user = getUser()
  const [memberships, setMemberships] = useState<MembershipType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [tokenBalance, setTokenBalance] = useState<number>(user?.tokenBalance ?? 0)
  const [savedWalletAddress, setSavedWalletAddress] = useState<string>(user?.walletAddress || '')
  const [transferHistory, setTransferHistory] = useState<MyTokenTransfer[]>([])
  const [transferLoading, setTransferLoading] = useState(true)
  const [transferError, setTransferError] = useState<string | null>(null)
  const [manualWalletAddress, setManualWalletAddress] = useState('')
  const [sendWalletAddress, setSendWalletAddress] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [isSending, setIsSending] = useState(false)

  const walletAddress = useMemo(() => {
    if (savedWalletAddress) return savedWalletAddress
    return createWalletAddress(`${user?.userId ?? ''}-${user?.email ?? ''}`)
  }, [savedWalletAddress, user?.email, user?.userId])

  const activeMemberships = useMemo(
    () => memberships.filter((membership) => membership.status === 'active'),
    [memberships]
  )

  const canReceiveSbt = activeMemberships.length > 0

  useEffect(() => {
    import('../utils/token').then(({ autoRefreshTokenIfNeeded }) => {
      autoRefreshTokenIfNeeded()
    })
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const targetId = location.hash.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  useEffect(() => {
    const loadMemberships = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getMemberships()
        setMemberships(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '지갑 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadMemberships()
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile()
        setTokenBalance(profile.tokenBalance ?? 0)
        setSavedWalletAddress(profile.walletAddress || '')
        saveUser({
          userId: profile.userId,
          username: profile.username,
          email: profile.email || '',
          name: profile.name,
          tokenBalance: profile.tokenBalance ?? 0,
          walletAddress: profile.walletAddress || '',
          role: profile.role,
        })
      } catch {
        setTokenBalance(user?.tokenBalance ?? 0)
      }
    }
    loadProfile()
  }, [user?.tokenBalance, user?.walletAddress])

  useEffect(() => {
    const loadTransfers = async () => {
      try {
        setTransferLoading(true)
        setTransferError(null)
        const rows = await getMyTokenTransfers()
        setTransferHistory(rows)
      } catch {
        setTransferHistory([])
        setTransferError('지급 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        setTransferLoading(false)
      }
    }
    loadTransfers()
  }, [])

  const reloadTransfers = async () => {
    try {
      setTransferLoading(true)
      setTransferError(null)
      const rows = await getMyTokenTransfers()
      setTransferHistory(rows)
    } catch {
      setTransferHistory([])
      setTransferError('지급 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setTransferLoading(false)
    }
  }

  const handleSaveWalletAddress = async (address: string) => {
    try {
      const profile = await saveMyWalletAddress(address)
      setSavedWalletAddress(profile.walletAddress || address)
      saveUser({
        userId: profile.userId,
        username: profile.username,
        email: profile.email || '',
        name: profile.name,
        tokenBalance: profile.tokenBalance ?? 0,
        walletAddress: profile.walletAddress || address,
        role: profile.role,
      })
      alert('지갑 주소가 저장되었습니다.')
    } catch (error) {
      alert(error instanceof Error ? error.message : '지갑 주소 저장 중 오류가 발생했습니다.')
    }
  }

  const handleCopyTxHash = async (hash?: string) => {
    if (!hash) return
    try {
      await navigator.clipboard.writeText(hash)
      alert('트랜잭션 해시가 복사되었습니다.')
    } catch {
      alert('복사에 실패했습니다.')
    }
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      alert('주소 복사에 실패했습니다. 수동으로 복사해주세요.')
    }
  }

  const handleManualWalletSave = async () => {
    const address = manualWalletAddress.trim()
    if (!address) {
      alert('지갑 주소를 입력해 주세요.')
      return
    }
    await handleSaveWalletAddress(address)
    setManualWalletAddress('')
  }

  const handleSendToken = async () => {
    const receiverWalletAddress = sendWalletAddress.trim()
    const amount = sendAmount.trim()

    if (!receiverWalletAddress) {
      alert('받는 지갑 주소를 입력해 주세요.')
      return
    }

    if (!receiverWalletAddress.startsWith('0x') || receiverWalletAddress.length < 20) {
      alert('올바른 지갑 주소 형식이 아닙니다.')
      return
    }

    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('전송 수량은 0보다 큰 숫자여야 합니다.')
      return
    }

    setIsSending(true)
    try {
      await sendMyToken(receiverWalletAddress, amount)
      alert('토큰 전송 요청이 접수되었습니다.')
      setSendWalletAddress('')
      setSendAmount('')
      await reloadTransfers()
    } catch (error) {
      alert(error instanceof Error ? error.message : '토큰 전송 중 오류가 발생했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="token-wallet">
      <Header />
      <div className="container">
        <h1>개인 토큰 지갑</h1>
        <p className="subtitle">회원권 기반 SBT 수령 상태와 개인 지갑 주소를 확인하세요</p>

        <div id="wallet-overview" className="wallet-card">
          <div className="wallet-card__header">
            <div>
              <p className="wallet-card__label">지갑 소유자</p>
              <h2>{user?.name || '회원'}님의 SBT 지갑</h2>
            </div>
            <span className={`wallet-status ${canReceiveSbt ? 'wallet-status--active' : 'wallet-status--inactive'}`}>
              {canReceiveSbt ? 'SBT 수령 가능' : '수령 조건 미충족'}
            </span>
          </div>

          <div className="wallet-address-box">
            <p className="wallet-card__label">지갑 주소</p>
            <div className="wallet-address-row">
              <code>{shortenAddress(walletAddress)}</code>
              <button type="button" onClick={handleCopyAddress}>
                {copied ? '복사됨' : '주소 복사'}
              </button>
            </div>
            <p className="wallet-address-full">{walletAddress}</p>
          </div>
        </div>

        <div className="wallet-grid">
          <section className="wallet-panel">
            <h3>SBT 수령 조건</h3>
            {isLoading ? (
              <p className="wallet-muted">회원권 정보를 확인하는 중...</p>
            ) : error ? (
              <p className="wallet-error">{error}</p>
            ) : canReceiveSbt ? (
              <>
                <p className="wallet-success">활성 회원권이 확인되어 SBT 수령이 가능합니다.</p>
                <ul>
                  {activeMemberships.map((membership) => (
                    <li key={membership.id}>
                      {membership.membershipType} ({membership.membershipNumber})
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="wallet-muted">
                활성 회원권이 없습니다. `회원권` 페이지에서 상태를 확인한 뒤 수령을 진행해 주세요.
              </p>
            )}
          </section>

          <section className="wallet-panel">
            <h3>예상 수령 토큰</h3>
            <div className="token-rows">
              <div className="token-row">
                <span>Membership SBT</span>
                <strong>{tokenBalance} EA</strong>
              </div>
              <div className="token-row">
                <span>지갑 상태</span>
                <strong>{canReceiveSbt ? 'Ready' : 'Pending'}</strong>
              </div>
            </div>
            <p className="wallet-muted">
              실제 SBT 발급은 관리자 배치 또는 온체인 민팅 프로세스와 연동될 때 자동 반영됩니다.
            </p>
          </section>
          <section id="token-settings" className="wallet-panel">
            <h3>토큰 설정</h3>
            <div className="wallet-manual-form">
              <label htmlFor="walletAddressInput">수령 지갑 주소</label>
              <input
                id="walletAddressInput"
                type="text"
                placeholder="0x로 시작하는 지갑 주소 입력"
                value={manualWalletAddress}
                onChange={(e) => setManualWalletAddress(e.target.value)}
              />
              <button type="button" className="wallet-connect-btn" onClick={handleManualWalletSave}>
                지갑 주소 저장
              </button>
            </div>
            {PRIVY_ENABLED && <PrivyWalletConnector onWalletSaved={handleSaveWalletAddress} />}
          </section>

          <section id="token-send" className="wallet-panel">
            <h3>토큰 보내기</h3>
            <div className="wallet-send-form">
              <label htmlFor="sendWalletAddressInput">받는 지갑 주소</label>
              <input
                id="sendWalletAddressInput"
                type="text"
                placeholder="0x로 시작하는 주소 입력"
                value={sendWalletAddress}
                onChange={(e) => setSendWalletAddress(e.target.value)}
              />
              <label htmlFor="sendAmountInput">전송 수량</label>
              <input
                id="sendAmountInput"
                type="number"
                min="0"
                step="1"
                placeholder="예: 10"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
              <button type="button" className="wallet-connect-btn" onClick={handleSendToken} disabled={isSending}>
                {isSending ? '전송 중...' : '토큰 보내기'}
              </button>
            </div>
            <p className="wallet-muted">전송 결과는 하단 지급 이력에서 상태를 확인할 수 있습니다.</p>
          </section>
        </div>

        <section className="wallet-history" aria-labelledby="wallet-history-heading">
          <div className="wallet-history__header">
            <h3 id="wallet-history-heading">토큰 지급 이력</h3>
            <p className="wallet-history__hint">일시, 트랜잭션 해시(Tx Hash), 처리 상태를 확인할 수 있습니다.</p>
          </div>

          {transferLoading ? (
            <p className="wallet-muted">지급 이력을 불러오는 중...</p>
          ) : transferError ? (
            <p className="wallet-error">{transferError}</p>
          ) : transferHistory.length === 0 ? (
            <p className="wallet-muted">아직 지급 이력이 없습니다.</p>
          ) : (
            <div className="wallet-history__scroll">
              <table className="wallet-history-table">
                <thead>
                  <tr>
                    <th scope="col">일시</th>
                    <th scope="col">금액</th>
                    <th scope="col">Tx Hash</th>
                    <th scope="col">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {transferHistory.map((row) => (
                    <tr key={row.id}>
                      <td>{formatTransferDate(row.createdAt)}</td>
                      <td>
                        <span className="wallet-history-amount">
                          {row.amount} {row.tokenSymbol}
                        </span>
                      </td>
                      <td>
                        <div className="wallet-history-tx">
                          <code title={row.txHash}>{shortenTxHash(row.txHash)}</code>
                          {row.txHash ? (
                            <button
                              type="button"
                              className="wallet-history-copy"
                              onClick={() => handleCopyTxHash(row.txHash)}
                              aria-label="Tx Hash 복사"
                            >
                              복사
                            </button>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`wallet-history-status wallet-history-status--${row.status}`}
                          title={row.status === 'failed' && row.errorMessage ? row.errorMessage : undefined}
                        >
                          {transferStatusLabel(row.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TokenWallet

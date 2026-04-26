import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { getUser } from '../utils/token'
import { getMemberships } from '../services/membershipService'
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

const TokenWallet = () => {
  const user = getUser()
  const [memberships, setMemberships] = useState<MembershipType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const walletAddress = useMemo(
    () => createWalletAddress(`${user?.userId ?? ''}-${user?.email ?? ''}`),
    [user?.email, user?.userId]
  )

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

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      alert('주소 복사에 실패했습니다. 수동으로 복사해주세요.')
    }
  }

  return (
    <div className="token-wallet">
      <Header />
      <div className="container">
        <h1>개인 토큰 지갑</h1>
        <p className="subtitle">회원권 기반 SBT 수령 상태와 개인 지갑 주소를 확인하세요</p>

        <div className="wallet-card">
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
                <strong>{canReceiveSbt ? `${activeMemberships.length} EA` : '0 EA'}</strong>
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
        </div>
      </div>
    </div>
  )
}

export default TokenWallet

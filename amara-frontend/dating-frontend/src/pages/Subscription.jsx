import React, { useEffect, useState } from 'react'
import {
  activatePlan,
  createRazorpayOrder,
  getRemainingDays,
  getSubscriptionStatus,
  verifyRazorpayPayment,
} from '../api/account'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import ThreadDivider from '../components/ThreadDivider'

const PLANS = [
  { key: 'FREE', label: 'Free', price: 0, perks: ['Browse profiles', 'Limited daily requests'] },
  { key: 'GOLD', label: 'Gold', price: 199, perks: ['Unlimited requests', 'See who liked you'] },
  { key: 'PREMIUM', label: 'Premium', price: 499, perks: ['Everything in Gold', 'Priority placement', 'Advanced filters'] },
]

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Subscription() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [status, setStatus] = useState(null)
  const [remainingDays, setRemainingDays] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payingPlan, setPayingPlan] = useState(null)

  useEffect(() => {
    Promise.all([
      getSubscriptionStatus(String(user.userId)).catch(() => null),
      getRemainingDays(String(user.userId)).catch(() => null),
    ]).then(([s, d]) => {
      setStatus(s)
      setRemainingDays(d)
      setLoading(false)
    })
  }, [user.userId])

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) {
      try {
        await activatePlan(String(user.userId), plan.key)
        showToast('Free plan activated', 'success')
      } catch {
        showToast('Could not activate plan', 'error')
      }
      return
    }

    setPayingPlan(plan.key)
    try {
      const scriptReady = await loadRazorpayScript()
      if (!scriptReady) {
        showToast('Could not load payment gateway', 'error')
        return
      }
      const order = await createRazorpayOrder(user.id, plan.key)

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID
      if (!razorpayKeyId) {
        showToast('Set VITE_RAZORPAY_KEY_ID in .env to enable checkout', 'error')
        return
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amountValue,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Amara',
        description: `${plan.label} plan`,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )
            showToast('Payment verified — subscription activated', 'success')
          } catch {
            showToast('Payment could not be verified', 'error')
          }
        },
        theme: { color: '#E8536B' },
      })
      rzp.open()
    } catch {
      showToast('Could not start checkout', 'error')
    } finally {
      setPayingPlan(null)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Unlock more</p>
        <h1 className="font-display text-3xl text-ink">Choose your plan</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      {loading ? (
        <Loader />
      ) : (
        (status || remainingDays !== null) && (
          <div className="card mb-8 p-4 text-center text-sm text-ink-soft">
            {status?.plan && <span className="font-semibold text-ember">{status.plan}</span>}
            {remainingDays !== null && remainingDays !== undefined && (
              <span> — {remainingDays} day(s) remaining</span>
            )}
          </div>
        )
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.key} className="card flex flex-col p-6">
            <p className="eyebrow mb-1">{plan.label}</p>
            <p className="font-display text-3xl text-ink">
              {plan.price === 0 ? 'Free' : `₹${plan.price}`}
              {plan.price > 0 && <span className="text-sm text-ink-faint">/mo</span>}
            </p>
            <ul className="my-4 flex-1 space-y-2 text-sm text-ink-soft">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-1 text-gold">✦</span>
                  {perk}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan)}
              disabled={payingPlan === plan.key}
              className={plan.key === 'PREMIUM' ? 'btn-gold' : 'btn-primary'}
            >
              {payingPlan === plan.key ? 'Processing…' : plan.price === 0 ? 'Activate' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

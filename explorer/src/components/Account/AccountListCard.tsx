import { bigNumberToNumber } from '@/utils/number'
import Identicon from '@polkadot/react-identicon'
import { MobileCard } from 'components/common/MobileCard'
import { INTERNAL_ROUTES } from 'constants/routes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Account } from 'gql/graphql'
import useDomains from 'hooks/useDomains'
import Link from 'next/link'
import { FC } from 'react'

dayjs.extend(relativeTime)

type Props = {
  account: Account
  index: number
}

export const AccountListCard: FC<Props> = ({ account, index }) => {
  const { selectedChain, selectedDomain } = useDomains()
  const body = [
    { name: 'Rank', value: index },
    { name: 'Extrinsics', value: account.extrinsics.length },
    { name: 'Locked (TSSC)', value: bigNumberToNumber(account.reserved || 0) },
    { name: 'Balance (TSSC)', value: bigNumberToNumber(account.total || 0) },
  ]
  return (
    <MobileCard
      id='account-list-mobile'
      header={
        <div key={`${account.id}-account-id`} className='row -mx-1 -mt-3 flex items-center gap-3'>
          <Identicon value={account.id} size={49} theme='beachball' />
          <Link
            href={INTERNAL_ROUTES.accounts.id.page(
              selectedChain.urls.page,
              selectedDomain,
              account.id,
            )}
          >
            <p className='break-all text-sm font-medium text-grayDarker dark:text-white'>
              {account.id}
            </p>
          </Link>
        </div>
      }
      body={body}
    />
  )
}

import { MobileCard } from 'components/common/MobileCard'
import { StatusIcon } from 'components/common/StatusIcon'
import { INTERNAL_ROUTES } from 'constants/routes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Extrinsic } from 'gql/graphql'
import useDomains from 'hooks/useDomains'
import Link from 'next/link'
import { FC } from 'react'

dayjs.extend(relativeTime)

type Props = {
  extrinsic: Extrinsic
}
// TODO: similar to ExtrinsicListCard, consider refactoring
export const HomeExtrinsicCard: FC<Props> = ({ extrinsic }) => {
  const { selectedChain, selectedDomain } = useDomains()
  const blockDate = dayjs(extrinsic.block.timestamp).fromNow(true)

  const body = [
    { name: 'Block', value: extrinsic.block.height },
    { name: 'Call', value: extrinsic.name.split('.')[1].toUpperCase() },
    { name: 'Time', value: `${blockDate} ago` },
  ]
  return (
    <MobileCard
      id='home-extrinsic-list-mobile'
      header={
        <Link
          className='flex gap-1'
          href={INTERNAL_ROUTES.extrinsics.id.page(
            selectedChain.urls.page,
            selectedDomain,
            extrinsic.id,
          )}
        >
          <StatusIcon status={extrinsic.success} />
          <h3 className='text-sm font-medium text-grayDarker dark:text-white'>{`${extrinsic.block.height}-${extrinsic.indexInBlock}`}</h3>
        </Link>
      }
      body={body}
    />
  )
}

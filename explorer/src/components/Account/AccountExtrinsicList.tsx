/* eslint-disable camelcase */
import { useApolloClient, useQuery } from '@apollo/client'
import { SortingState } from '@tanstack/react-table'
import { CopyButton } from 'components/common/CopyButton'
import { NewTable } from 'components/common/NewTable'
import { Spinner } from 'components/common/Spinner'
import { StatusIcon } from 'components/common/StatusIcon'
import { NotFound } from 'components/layout/NotFound'
import { PAGE_SIZE } from 'constants/general'
import { INTERNAL_ROUTES } from 'constants/routes'
import dayjs from 'dayjs'
import { Extrinsic, ExtrinsicWhereInput, ExtrinsicsByAccountIdQuery } from 'gql/graphql'
import useDomains from 'hooks/useDomains'
import Link from 'next/link'
import { FC, useCallback, useMemo, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { downloadFullData } from 'utils/downloadFullData'
import { sort } from 'utils/sort'
import { shortString } from 'utils/string'
import { ExtrinsicListCard } from '../Extrinsic/ExtrinsicListCard'
import { AccountExtrinsicFilterDropdown } from './AccountExtrinsicFilterDropdown'
import { QUERY_ACCOUNT_EXTRINSICS } from './query'

type Props = {
  accountId: string
}

type Row = {
  row: {
    index: number
    original: Extrinsic
  }
}

export const AccountExtrinsicList: FC<Props> = ({ accountId }) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'block_height', desc: true }])
  const [pagination, setPagination] = useState({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  })
  const [filters, setFilters] = useState<ExtrinsicWhereInput>({})

  const { selectedChain, selectedDomain } = useDomains()
  const apolloClient = useApolloClient()

  const orderBy = useMemo(() => sort(sorting, 'block_height_DESC'), [sorting])

  const getQueryVariables = useCallback(
    (
      sorting: SortingState,
      pagination: {
        pageSize: number
        pageIndex: number
      },
      filters: ExtrinsicWhereInput,
      accountId: string,
    ) => {
      return {
        first: pagination.pageSize,
        after:
          pagination.pageIndex > 0
            ? (pagination.pageIndex * pagination.pageSize).toString()
            : undefined,
        orderBy,
        where: {
          ...filters,
          signer: {
            id_eq: accountId,
          },
        },
      }
    },
    [orderBy],
  )

  const { data, error, loading } = useQuery<ExtrinsicsByAccountIdQuery>(QUERY_ACCOUNT_EXTRINSICS, {
    variables: getQueryVariables(sorting, pagination, filters, accountId),
    pollInterval: 6000,
  })

  useErrorHandler(error)

  const fullDataDownloader = useCallback(
    () =>
      downloadFullData(apolloClient, QUERY_ACCOUNT_EXTRINSICS, 'extrinsicsConnection', { orderBy }),
    [apolloClient, orderBy],
  )

  const extrinsicsConnection = useMemo(() => data && data.extrinsicsConnection, [data])
  const extrinsics = useMemo(
    () =>
      extrinsicsConnection &&
      extrinsicsConnection.edges.map((extrinsic) => extrinsic.node as Extrinsic),
    [extrinsicsConnection],
  )
  const totalCount = useMemo(
    () => extrinsicsConnection && extrinsicsConnection.totalCount,
    [extrinsicsConnection],
  )
  const pageCount = useMemo(
    () => (totalCount ? Math.floor(totalCount / pagination.pageSize) : 0),
    [totalCount, pagination.pageSize],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Extrinsic Id',
        enableSorting: true,
        cell: ({ row }: Row) => (
          <Link
            key={`${row.original.id}-extrinsic-block-${row.original.indexInBlock}`}
            className='hover:text-purpleAccent'
            href={INTERNAL_ROUTES.extrinsics.id.page(
              selectedChain.urls.page,
              selectedDomain,
              row.original.id,
            )}
          >
            <div>{`${row.original.block.height}-${row.original.indexInBlock}`}</div>
          </Link>
        ),
      },
      {
        accessorKey: 'timestamp',
        header: 'Time',
        enableSorting: true,
        cell: ({ row }) => {
          const blockDate = dayjs(row.original.block.timestamp).fromNow(true)

          return <div key={`${row.original.id}-extrinsic-time-${row.index}`}>{blockDate}</div>
        },
      },
      {
        accessorKey: 'success',
        header: 'Status',
        enableSorting: true,
        cell: ({ row }) => (
          <div
            className='md:flex md:items-center md:justify-start md:pl-5'
            key={`${row.original.id}-home-extrinsic-status-${row.index}`}
          >
            <StatusIcon status={row.original.success} />
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Action',
        enableSorting: true,
        cell: ({ row }) => (
          <div key={`${row.original.id}-extrinsic-action-${row.index}`}>
            {row.original.name.split('.')[1].toUpperCase()}
          </div>
        ),
      },
      {
        accessorKey: 'hash',
        header: 'Block hash',
        enableSorting: true,
        cell: ({ row }) => (
          <div key={`${row.original.id}-extrinsic-hash-${row.index}`}>
            <CopyButton value={row.original.hash} message='Hash copied'>
              {shortString(row.original.hash)}
            </CopyButton>
          </div>
        ),
      },
    ],
    [selectedDomain, selectedChain],
  )

  if (loading) return <Spinner />
  if (!data || !extrinsics) return <NotFound />

  return (
    <div className='mt-5 flex w-full flex-col align-middle'>
      <div className='mt-6 rounded-[20px] bg-white p-6 dark:border-none dark:bg-gradient-to-r dark:from-gradientTwilight dark:via-gradientDusk dark:to-gradientSunset'>
        <div className='flex w-full justify-center gap-2'>
          <div className='text-sm text-purpleShade2 dark:text-white/75'>Action Filter:</div>
          <AccountExtrinsicFilterDropdown filters={filters} setFilters={setFilters} />
        </div>
      </div>
      <div className='my-6 rounded'>
        <NewTable
          data={extrinsics}
          columns={columns}
          showNavigation={true}
          sorting={sorting}
          onSortingChange={setSorting}
          pagination={pagination}
          pageCount={pageCount}
          onPaginationChange={setPagination}
          filename='account-extrinsic-list'
          fullDataDownloader={fullDataDownloader}
          mobileComponent={<MobileComponent extrinsics={extrinsics} />}
        />
      </div>
    </div>
  )
}

type MobileComponentProps = {
  extrinsics: Extrinsic[]
}

const MobileComponent: FC<MobileComponentProps> = ({ extrinsics }) => (
  <div className='w-full'>
    {extrinsics.map((extrinsic, index) => (
      <ExtrinsicListCard
        extrinsic={extrinsic}
        key={`extrinsic-list-card-${extrinsic.id}-${index}`}
      />
    ))}
  </div>
)

import { useApolloClient, useQuery } from '@apollo/client'
import { SortingState } from '@tanstack/react-table'
import { Operator } from 'gql/graphql'
import { FC, useCallback, useMemo, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { Link } from 'react-router-dom'

// common
import { SearchBar, Spinner } from 'common/components'
import NewTable from 'common/components/NewTable'
import { PAGE_SIZE } from 'common/constants'
import { bigNumberToNumber, downloadFullData, numberWithCommas, shortString } from 'common/helpers'
import useDomains from 'common/hooks/useDomains'
import { INTERNAL_ROUTES } from 'common/routes'

// operator
import { QUERY_OPERATOR_CONNECTION_LIST } from 'Operator/query'
import OperatorsListCard from './OperatorsListCard'

const OperatorsList: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: false }])
  const [pagination, setPagination] = useState({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  })

  const { selectedChain, selectedDomain } = useDomains()
  const apolloClient = useApolloClient()

  const chain = selectedChain.urls.page

  const cols = useMemo(() => createColumns(selectedDomain, chain), [selectedDomain, chain])

  const { data, error, loading } = useQuery(QUERY_OPERATOR_CONNECTION_LIST, {
    variables: getQueryVariables(sorting, pagination),
    pollInterval: 6000,
  })

  useErrorHandler(error)

  const fullDataDownloader = useCallback(
    () => downloadFullData(apolloClient, QUERY_OPERATOR_CONNECTION_LIST),
    [apolloClient],
  )

  if (loading) {
    return <Spinner />
  }

  const operatorsConnection = data.operatorsConnection.edges.map((operator) => operator.node)
  const totalCount = data.operatorsConnection.totalCount
  const totalLabel = numberWithCommas(Number(totalCount))

  const pageCount = Math.floor(totalCount / pagination.pageSize)

  return (
    <div className='w-full flex flex-col align-middle'>
      <div className='w-full grid lg:grid-cols-2'>
        <SearchBar />
      </div>
      <div className='w-full flex justify-between mt-5'>
        <div className='text-[#282929] text-base font-medium dark:text-white'>{`Operators (${totalLabel})`}</div>
      </div>
      <div className='w-full flex flex-col mt-5 sm:mt-0'>
        <div className='rounded my-6'>
          <NewTable
            data={operatorsConnection}
            columns={cols}
            showNavigation={true}
            sorting={sorting}
            onSortingChange={setSorting}
            pagination={pagination}
            pageCount={pageCount}
            onPaginationChange={setPagination}
            fullDataDownloader={fullDataDownloader}
            mobileComponent={<MobileComponent operators={operatorsConnection} />}
          />
        </div>
      </div>
    </div>
  )
}

export default OperatorsList

const createColumns = (selectedDomain, chain) => {
  return [
    {
      accessorKey: 'orderingId',
      header: 'Id',
      enableSorting: true,
      cell: ({ row }) => (
        <Link
          data-testid={`operator-link-${row.original.id}-${row.original.signingKey}-${row.index}}`}
          className='hover:text-[#DE67E4]'
          to={INTERNAL_ROUTES.operators.id.page(chain, selectedDomain, row.original.id)}
        >
          <div>{row.original.orderingId}</div>
        </Link>
      ),
    },
    {
      accessorKey: 'currentDomainId',
      header: 'Domain',
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.currentDomainId === 0 ? 'Subspace' : 'Nova'}</div>,
    },
    {
      accessorKey: 'signingKey',
      header: 'Signing Key',
      enableSorting: true,
      cell: ({ row }) => (
        <div className='flex row items-center gap-3'>
          <div>{shortString(row.original.signingKey)}</div>
        </div>
      ),
    },
    {
      accessorKey: 'minimumNominatorStake',
      header: 'Min. Stake',
      enableSorting: true,
      cell: ({ row }) => (
        <div>{`${bigNumberToNumber(row.original.minimumNominatorStake)} tSSC`}</div>
      ),
    },
    {
      accessorKey: 'nominationTax',
      header: 'Nominator Tax',
      enableSorting: true,
      cell: ({ row }) => <div>{`${row.original.nominationTax}%`}</div>,
    },
    {
      accessorKey: 'currentTotalStake',
      header: 'Total Stake',
      enableSorting: true,
      cell: ({ row }) => <div>{`${bigNumberToNumber(row.original.currentTotalStake)} tSSC`}</div>,
    },
    {
      accessorKey: 'totalShares',
      header: 'Total Shares',
      enableSorting: true,
      cell: ({ row }) => <div>{numberWithCommas(row.original.totalShares)}</div>,
    },
    {
      accessorKey: 'nominators',
      header: 'Nominators',
      enableSorting: false,
      cell: ({ row }) => (
        <div>{`${row.original.nominators ? row.original.nominators.length : 0}/256`}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => <div>{row.original.status}</div>,
    },
  ]
}

const getQueryVariables = (sorting, pagination) => {
  return {
    first: pagination.pageSize,
    after:
      pagination.pageIndex > 0
        ? (pagination.pageIndex * pagination.pageSize).toString()
        : undefined,
    orderBy: sorting.map((s) => `${s.id}_${s.desc ? 'DESC' : 'ASC'}`).join(',') || 'orderingId_ASC',
  }
}

type MobileComponentProps = {
  operators: Operator[]
}

const MobileComponent: FC<MobileComponentProps> = ({ operators }) => (
  <div className='w-full'>
    {operators.map((operator, index) => (
      <OperatorsListCard
        index={index}
        operator={operator}
        key={`operator-list-card-${operator.id}`}
      />
    ))}
  </div>
)

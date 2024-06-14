/* eslint-disable camelcase */
import { FilterIcon } from '@/components/icons/FilterIcon'
import { BasicDatepicker } from 'components/common/BasicDatepicker'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import { EventWhereInput, ExtrinsicWhereInput } from 'gql/graphql'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Accordion } from './Accordion'

dayjs.extend(relativeTime)
dayjs.extend(utc)

type Props = {
  title: React.ReactNode
  filters: ExtrinsicWhereInput | EventWhereInput
  account: string
  where: ExtrinsicWhereInput | EventWhereInput
  setWhere: React.Dispatch<React.SetStateAction<ExtrinsicWhereInput | EventWhereInput>>
  setFilters: React.Dispatch<React.SetStateAction<ExtrinsicWhereInput | EventWhereInput>>
  handleAccountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  modules?: string[]
}

export const FilterForm: FC<Props> = ({
  title,
  filters,
  account,
  where,
  setWhere,
  setFilters,
  handleAccountChange,
  modules,
}) => {
  const [timeDimension, setTimeDimension] = useState<'date' | 'block'>('block')

  useEffect(() => {
    if (filters?.block?.height_gte && filters?.block?.height_lte) setTimeDimension('block')
    else if (filters?.timestamp_gte && filters?.timestamp_lte) setTimeDimension('date')
  }, [filters])

  const handleModuleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setWhere((prev) => ({ ...prev, name_containsInsensitive: e.target.value })),
    [setWhere],
  )

  const handleTimeDimensionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setTimeDimension(e.target.value as 'date' | 'block'),
    [],
  )

  const handleBlockFrom = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setWhere((prev) => ({ ...prev, block: { ...where?.block, height_gte: e.target.value } })),
    [setWhere, where?.block],
  )

  const handleBlockTo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setWhere((prev) => ({ ...prev, block: { ...where?.block, height_lte: e.target.value } })),
    [setWhere, where?.block],
  )

  const handleDateFrom = useCallback(
    (date: Date) =>
      setWhere((prev) => ({
        ...prev,
        timestamp_gte: dayjs(date).utc().format(),
      })),
    [setWhere],
  )

  const handleDateTo = useCallback(
    (date: Date) =>
      setWhere((prev) => ({
        ...prev,
        timestamp_lte: dayjs(date).utc().format(),
      })),
    [setWhere],
  )

  const handleFilter = useCallback(() => setFilters(where), [setFilters, where])

  const modulesFormatted = useMemo(
    () => [
      { label: 'All', value: undefined },
      ...Array.from(new Set(modules)).map((module) => ({
        value: module,
        label: module,
      })),
    ],
    [modules],
  )

  return (
    <div className='w-full'>
      <Accordion
        title={title}
        icon={
          <div className='text-[#DE67E4] dark:text-[#1E254E]'>
            <FilterIcon />
          </div>
        }
      >
        <div className='w-full rounded-[20px] bg-[#DDEFF1] p-5 shadow dark:border-none dark:bg-gradient-to-r dark:from-[#4141B3] dark:via-[#6B5ACF] dark:to-[#896BD2]'>
          <div>
            <div className='mt-4 grid grid-cols-2 items-end gap-4 md:grid-cols-5'>
              <div className='flex flex-col gap-3'>
                <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>
                  Module
                </div>
                <select
                  value={where?.name_containsInsensitive || ''}
                  onChange={handleModuleChange}
                  className='w-full rounded-[42px] border-transparent bg-white px-4 py-3 text-sm focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-[#1E254E] dark:text-white'
                >
                  {modulesFormatted.map((module) => (
                    <option key={module.value ? module.value : 'all'} value={module.value}>
                      {module.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>Call</div>
                <select className='w-full rounded-[42px] border-transparent bg-white px-4 py-3 text-sm focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-[#1E254E] dark:text-white'>
                  <option value=''>All</option>
                </select>
              </div>

              <div className='flex flex-col gap-3 md:col-span-3'>
                <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>
                  Account
                </div>
                <input
                  type='text'
                  placeholder='Optional'
                  onChange={handleAccountChange}
                  value={account}
                  className='w-full rounded-[42px] border-transparent bg-white px-4 py-3 text-sm focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-[#1E254E] dark:text-white'
                />
              </div>
              <div className='flex flex-col gap-3'>
                <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>
                  Time Dimension
                </div>

                <select
                  onChange={handleTimeDimensionChange}
                  value={timeDimension}
                  className='w-full rounded-[42px] border-transparent bg-white px-4 py-3 text-sm focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-[#1E254E] dark:text-white'
                >
                  <option value='block'>Block</option>
                  <option value='date'>Date</option>
                </select>
              </div>

              <>
                {timeDimension === 'block' ? (
                  <>
                    <div className='flex flex-col gap-3'>
                      <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>
                        From
                      </div>
                      <input
                        value={where?.block?.height_gte || ''}
                        onChange={handleBlockFrom}
                        type='text'
                        placeholder='from'
                        className='w-full rounded-[42px] border-transparent bg-white px-4 py-3 text-sm focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-[#1E254E] dark:text-white'
                      />
                    </div>

                    <div className='flex flex-col gap-3'>
                      <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>
                        To
                      </div>
                      <input
                        value={where?.block?.height_lte || ''}
                        onChange={handleBlockTo}
                        type='text'
                        placeholder='to'
                        className='w-full rounded-[42px] border-transparent bg-white px-4 py-3 text-sm focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-[#1E254E] dark:text-white'
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex flex-col gap-3'>
                      <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>
                        Start Date
                      </div>

                      <BasicDatepicker
                        value={where?.timestamp_gte || ''}
                        onChange={handleDateFrom}
                      />
                    </div>

                    <div className='flex flex-col gap-3'>
                      <div className='text-[13px] font-semibold text-[#282929] dark:text-white'>
                        To Date
                      </div>

                      <BasicDatepicker
                        minDate={where?.timestamp_gte}
                        value={where?.timestamp_lte || ''}
                        onChange={handleDateTo}
                      />
                    </div>
                  </>
                )}
              </>

              <button
                onClick={handleFilter}
                className='rounded-[20px] bg-white px-[33px] py-[13px] text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-[#1E254E] dark:text-white md:col-span-2 md:justify-self-end'
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  )
}

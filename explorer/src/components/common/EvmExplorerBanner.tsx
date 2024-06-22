import { EXTERNAL_ROUTES } from 'constants/routes'
import useDomains from 'hooks/useDomains'
import Link from 'next/link'
import React, { FC, useMemo } from 'react'

export const EvmExplorerBanner: FC<{ path?: string }> = ({ path }) => {
  const href = useMemo(
    () => (path ? EXTERNAL_ROUTES.novaExplorer + path : EXTERNAL_ROUTES.novaExplorer),
    [path],
  )
  return (
    <div className='w-full'>
      <div className='w-full rounded-[20px] bg-[#DDEFF1] p-5 shadow dark:border-none dark:bg-gradient-to-r dark:from-[#4141B3] dark:via-[#6B5ACF] dark:to-[#896BD2]'>
        <div className='flex flex-col gap-4'>
          <div className='text-[20px] font-bold text-[#282929] dark:text-white'>
            Explore Nova with Blockscout
          </div>
          <div className='text-[15px] text-[#282929] dark:text-white'>
            Nova is an EVM domain. To interact with smart contracts and access EVM native functionality,
            we recommend using our Blockscout explorer.
          </div>
          <Link href={href} target='_blank'>
            <button className='self-start rounded-[20px] bg-white px-[33px] py-[13px] text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-[#1E254E] dark:text-white'>
              Visit
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export const useEvmExplorerBanner = (path?: string) => {
  const { selectedChain } = useDomains()

  const novaExplorerBanner = useMemo(
    () => (selectedChain?.isDomain ? <EvmExplorerBanner path={path} /> : null),
    [path, selectedChain],
  )

  return novaExplorerBanner
}
